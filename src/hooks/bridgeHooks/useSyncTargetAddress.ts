import {
  canonicalAddress,
  CHAIN_ID_TERRA,
  isEVMChain,
  uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { arrayify, zeroPad } from "@ethersproject/bytes";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import { setTargetAddressHex as setNFTTargetAddressHex } from "src/store/nftSlice";
import {
  selectNFTTargetAsset,
  selectNFTTargetChain,
  selectTransferTargetAsset,
  selectTransferTargetChain,
  selectTransferTargetParsedTokenAccount,
} from "src/store/selectors";
import { setTargetAddressHex as setTransferTargetAddressHex } from "src/store/transferSlice";

function useSyncTargetAddress(shouldFire: boolean, nft?: boolean) {
  const dispatch = useDispatch();
  const targetChain = useSelector(
    nft ? selectNFTTargetChain : selectTransferTargetChain
  );
  const { signerAddress } = useEthereumProvider();
  const targetAsset = useSelector(
    nft ? selectNFTTargetAsset : selectTransferTargetAsset
  );
  const targetParsedTokenAccount = useSelector(
    selectTransferTargetParsedTokenAccount
  );
  const targetTokenAccountPublicKey = targetParsedTokenAccount?.publicKey;
  const terraWallet = useConnectedWallet();
  const setTargetAddressHex = nft
    ? setNFTTargetAddressHex
    : setTransferTargetAddressHex;
  useEffect(() => {
    if (shouldFire) {
      let cancelled = false;
      if (isEVMChain(targetChain) && signerAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(zeroPad(arrayify(signerAddress), 32))
          )
        );
      }
      else if (
        targetChain === CHAIN_ID_TERRA &&
        terraWallet &&
        terraWallet.walletAddress
      ) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(
              zeroPad(canonicalAddress(terraWallet.walletAddress), 32)
            )
          )
        );
      } else {
        dispatch(setTargetAddressHex(undefined));
      }
      return () => {
        cancelled = true;
      };
    }
    return ;
  }, [
    dispatch,
    shouldFire,
    targetChain,
    signerAddress,
    targetAsset,
    targetTokenAccountPublicKey,
    terraWallet,
    nft,
    setTargetAddressHex,
  ]);
}

export default useSyncTargetAddress;

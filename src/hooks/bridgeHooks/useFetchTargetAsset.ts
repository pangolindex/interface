import {
  ChainId,
  CHAIN_ID_TERRA,
  getForeignAssetEth,
  getForeignAssetTerra,
  hexToNativeString,
  hexToUint8Array,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import {
  getForeignAssetEth as getForeignAssetEthNFT,
} from "@certusone/wormhole-sdk/lib/esm/nft_bridge";
import { LCDClient } from "@terra-money/terra.js";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import {
  errorDataWrapper,
  fetchDataWrapper,
  receiveDataWrapper,
} from "src/store/helpers";
import { setTargetAsset as setNFTTargetAsset } from "src/store/nftSlice";
import {
  selectNFTIsSourceAssetWormholeWrapped,
  selectNFTOriginAsset,
  selectNFTOriginChain,
  selectNFTOriginTokenId,
  selectNFTTargetChain,
  selectTransferIsSourceAssetWormholeWrapped,
  selectTransferOriginAsset,
  selectTransferOriginChain,
  selectTransferTargetChain,
} from "src/store/selectors";
import { setTargetAsset as setTransferTargetAsset } from "src/store/transferSlice";
import {
  getEvmChainId,
  getNFTBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  TERRA_HOST,
  TERRA_TOKEN_BRIDGE_ADDRESS,
} from "src/utils/bridgeUtils/consts";

function useFetchTargetAsset(nft?: boolean) {
  const dispatch = useDispatch();
  const isSourceAssetWormholeWrapped = useSelector(
    nft
      ? selectNFTIsSourceAssetWormholeWrapped
      : selectTransferIsSourceAssetWormholeWrapped
  );
  const originChain = useSelector(
    nft ? selectNFTOriginChain : selectTransferOriginChain
  );
  const originAsset = useSelector(
    nft ? selectNFTOriginAsset : selectTransferOriginAsset
  );
  const originTokenId = useSelector(selectNFTOriginTokenId);
  const tokenId = originTokenId || ""; // this should exist by this step for NFT transfers
  const targetChain = useSelector(
    nft ? selectNFTTargetChain : selectTransferTargetChain
  );
  const setTargetAsset = nft ? setNFTTargetAsset : setTransferTargetAsset;
  const { provider, chainId: evmChainId } = useEthereumProvider();
  const correctEvmNetwork = getEvmChainId(targetChain);
  const hasCorrectEvmNetwork = evmChainId === correctEvmNetwork;
  const [lastSuccessfulArgs, setLastSuccessfulArgs] = useState<{
    isSourceAssetWormholeWrapped: boolean | undefined;
    originChain: ChainId | undefined;
    originAsset: string | undefined;
    targetChain: ChainId;
    nft?: boolean;
    tokenId?: string;
  } | null>(null);
  const argsMatchLastSuccess =
    !!lastSuccessfulArgs &&
    lastSuccessfulArgs.isSourceAssetWormholeWrapped ===
      isSourceAssetWormholeWrapped &&
    lastSuccessfulArgs.originChain === originChain &&
    lastSuccessfulArgs.originAsset === originAsset &&
    lastSuccessfulArgs.targetChain === targetChain &&
    lastSuccessfulArgs.nft === nft &&
    lastSuccessfulArgs.tokenId === tokenId;
  const setArgs = useCallback(
    () =>
      setLastSuccessfulArgs({
        isSourceAssetWormholeWrapped,
        originChain,
        originAsset,
        targetChain,
        nft,
        tokenId,
      }),
    [
      isSourceAssetWormholeWrapped,
      originChain,
      originAsset,
      targetChain,
      nft,
      tokenId,
    ]
  );
  useEffect(() => {
    if (argsMatchLastSuccess) {
      return;
    }
    setLastSuccessfulArgs(null);
    if (isSourceAssetWormholeWrapped && originChain === targetChain) {
      dispatch(
        setTargetAsset(
          receiveDataWrapper({
            doesExist: true,
            address: hexToNativeString(originAsset, originChain) || null,
          })
        )
      );
      setArgs();
      return;
    }
    let cancelled = false;
    (async () => {
      if (
        isEVMChain(targetChain) &&
        provider &&
        hasCorrectEvmNetwork &&
        originChain &&
        originAsset
      ) {
        dispatch(setTargetAsset(fetchDataWrapper()));
        try {
          const asset = await (nft
            ? getForeignAssetEthNFT(
                getNFTBridgeAddressForChain(targetChain),
                provider,
                originChain,
                hexToUint8Array(originAsset)
              )
            : getForeignAssetEth(
                getTokenBridgeAddressForChain(targetChain),
                provider,
                originChain,
                hexToUint8Array(originAsset)
              ));
          if (!cancelled) {
            dispatch(
              setTargetAsset(
                receiveDataWrapper({
                  doesExist: asset !== ethers.constants.AddressZero,
                  address: asset,
                })
              )
            );
            setArgs();
          }
        } catch (e) {
          if (!cancelled) {
            dispatch(
              setTargetAsset(
                errorDataWrapper(
                  "Unable to determine existence of wrapped asset"
                )
              )
            );
          }
        }
      }
      if (targetChain === CHAIN_ID_TERRA && originChain && originAsset) {
        dispatch(setTargetAsset(fetchDataWrapper()));
        try {
          const lcd = new LCDClient(TERRA_HOST);
          const asset = await getForeignAssetTerra(
            TERRA_TOKEN_BRIDGE_ADDRESS,
            lcd,
            originChain,
            hexToUint8Array(originAsset)
          );
          if (!cancelled) {
            dispatch(
              setTargetAsset(
                receiveDataWrapper({ doesExist: !!asset, address: asset })
              )
            );
            setArgs();
          }
        } catch (e) {
          if (!cancelled) {
            dispatch(
              setTargetAsset(
                errorDataWrapper(
                  "Unable to determine existence of wrapped asset"
                )
              )
            );
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    isSourceAssetWormholeWrapped,
    originChain,
    originAsset,
    targetChain,
    provider,
    nft,
    setTargetAsset,
    tokenId,
    hasCorrectEvmNetwork,
    argsMatchLastSuccess,
    setArgs,
  ]);
}

export default useFetchTargetAsset;
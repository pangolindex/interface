import React from 'react'
import {
  ChainId,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import {
  redeemOnEth,
} from "@certusone/wormhole-sdk/lib/esm/nft_bridge";
import { Alert } from "@material-ui/lab";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import { setIsRedeeming, setRedeemTx } from "src/store/nftSlice";
import { selectNFTIsRedeeming, selectNFTTargetChain } from "src/store/selectors";
import {
  getNFTBridgeAddressForChain,
} from "src/utils/bridgeUtils/consts";
import parseError from "src/utils/bridgeUtils/parseError";
import useNFTSignedVAA from "./useNFTSignedVAA";

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  signedVAA: Uint8Array,
  chainId: ChainId
) {
  dispatch(setIsRedeeming(true));
  try {
    const receipt = await redeemOnEth(
      getNFTBridgeAddressForChain(chainId),
      signer,
      signedVAA
    );
    dispatch(
      setRedeemTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsRedeeming(false));
  }
}

export function useHandleNFTRedeem() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const targetChain = useSelector(selectNFTTargetChain);
  const { signer } = useEthereumProvider();
  const signedVAA = useNFTSignedVAA();
  const isRedeeming = useSelector(selectNFTIsRedeeming);
  const handleRedeemClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && signedVAA) {
      evm(dispatch, enqueueSnackbar, signer, signedVAA, targetChain);
    } else {
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    signer,
    signedVAA,
  ]);
  return useMemo(
    () => ({
      handleClick: handleRedeemClick,
      disabled: !!isRedeeming,
      showLoader: !!isRedeeming,
    }),
    [handleRedeemClick, isRedeeming]
  );
}

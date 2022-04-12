import React from 'react'
import {
  ChainId,
  CHAIN_ID_TERRA,
  isEVMChain,
  redeemOnEth,
  redeemOnEthNative,
  redeemOnTerra,
} from "@certusone/wormhole-sdk";
import {
  ConnectedWallet,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import useTransferSignedVAA from "./useTransferSignedVAA";
import {
  selectTerraFeeDenom,
  selectTransferIsRedeeming,
  selectTransferTargetChain,
} from "src/store/selectors";
import { setIsRedeeming, setRedeemTx } from "src/store/transferSlice";
import {
  getTokenBridgeAddressForChain,
  TERRA_TOKEN_BRIDGE_ADDRESS,
} from "src/utils/bridgeUtils/consts";
import parseError from "src/utils/bridgeUtils/parseError";
import { postWithFees } from "src/utils/bridgeUtils/terra";
import { Text } from "@pangolindex/components"

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  signedVAA: Uint8Array,
  isNative: boolean,
  chainId: ChainId
) {
  dispatch(setIsRedeeming(true));
  try {
    const receipt = isNative
      ? await redeemOnEthNative(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA
        )
      : await redeemOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA
        );
    dispatch(
      setRedeemTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Text fontSize={15} fontWeight={200} lineHeight="20px" color="green1" >Transaction confirmed</Text>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >{parseError(e)}</Text>,
    });
    dispatch(setIsRedeeming(false));
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: ConnectedWallet,
  signedVAA: Uint8Array,
  feeDenom: string
) {
  dispatch(setIsRedeeming(true));
  try {
    const msg = await redeemOnTerra(
      TERRA_TOKEN_BRIDGE_ADDRESS,
      wallet.terraAddress,
      signedVAA
    );
    const result = await postWithFees(
      wallet,
      [msg],
      "Wormhole - Complete Transfer",
      [feeDenom]
    );
    dispatch(
      setRedeemTx({ id: result.result.txhash, block: result.result.height })
    );
    enqueueSnackbar(null, {
      content: <Text fontSize={15} fontWeight={200} lineHeight="20px" color="green1" >Transaction confirmed</Text>,
      
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >{parseError(e)}</Text>,
    });
    dispatch(setIsRedeeming(false));
  }
}

export function useHandleRedeem() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const targetChain = useSelector(selectTransferTargetChain);
  const { signer } = useEthereumProvider();
  const terraWallet = useConnectedWallet();
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const signedVAA = useTransferSignedVAA();
  const isRedeeming = useSelector(selectTransferIsRedeeming);
  const handleRedeemClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && signedVAA) {
      evm(dispatch, enqueueSnackbar, signer, signedVAA, false, targetChain);
    } else if (targetChain === CHAIN_ID_TERRA && !!terraWallet && signedVAA) {
      terra(dispatch, enqueueSnackbar, terraWallet, signedVAA, terraFeeDenom);
    } else {
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    signer,
    signedVAA,
    terraWallet,
    terraFeeDenom,
  ]);

  const handleRedeemNativeClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && signedVAA) {
      evm(dispatch, enqueueSnackbar, signer, signedVAA, true, targetChain);
    } else if (targetChain === CHAIN_ID_TERRA && !!terraWallet && signedVAA) {
      terra(dispatch, enqueueSnackbar, terraWallet, signedVAA, terraFeeDenom); //TODO isNative = true
    } else {
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    signer,
    signedVAA,
    terraWallet,
    terraFeeDenom,
  ]);

  return useMemo(
    () => ({
      handleNativeClick: handleRedeemNativeClick,
      handleClick: handleRedeemClick,
      disabled: !!isRedeeming,
      showLoader: !!isRedeeming,
    }),
    [handleRedeemClick, isRedeeming, handleRedeemNativeClick]
  );
}

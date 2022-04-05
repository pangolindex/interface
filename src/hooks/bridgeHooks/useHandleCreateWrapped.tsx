import React from 'react'
import {
  ChainId,
  CHAIN_ID_ACALA,
  CHAIN_ID_KARURA,
  CHAIN_ID_TERRA,
  createWrappedOnEth,
  createWrappedOnTerra,
  isEVMChain,
  updateWrappedOnEth,
  updateWrappedOnTerra,
} from "@certusone/wormhole-sdk";
import { Alert } from "@material-ui/lab";
import {
  ConnectedWallet,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import { setCreateTx, setIsCreating } from "src/store/attestSlice";
import {
  selectAttestIsCreating,
  selectAttestTargetChain,
  selectTerraFeeDenom,
} from "src/store/selectors";
import {
  ACALA_HOST,
  getTokenBridgeAddressForChain,
  KARURA_HOST,
  TERRA_TOKEN_BRIDGE_ADDRESS,
} from "src/utils/bridgeUtils/consts";
import { getKaruraGasParams } from "src/utils/bridgeUtils/karura";
import parseError from "src/utils/bridgeUtils/parseError";
import { postWithFees } from "src/utils/bridgeUtils/terra";
import useAttestSignedVAA from "./useAttestSignedVAA";

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  signedVAA: Uint8Array,
  chainId: ChainId,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  try {
    // Karura and Acala need gas params for contract deploys
    const overrides =
      chainId === CHAIN_ID_KARURA
        ? await getKaruraGasParams(KARURA_HOST)
        : chainId === CHAIN_ID_ACALA
        ? await getKaruraGasParams(ACALA_HOST)
        : {};
    const receipt = shouldUpdate
      ? await updateWrappedOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        )
      : await createWrappedOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        );
    dispatch(
      setCreateTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: ConnectedWallet,
  signedVAA: Uint8Array,
  shouldUpdate: boolean,
  feeDenom: string
) {
  dispatch(setIsCreating(true));
  try {
    const msg = shouldUpdate
      ? await updateWrappedOnTerra(
          TERRA_TOKEN_BRIDGE_ADDRESS,
          wallet.terraAddress,
          signedVAA
        )
      : await createWrappedOnTerra(
          TERRA_TOKEN_BRIDGE_ADDRESS,
          wallet.terraAddress,
          signedVAA
        );
    const result = await postWithFees(
      wallet,
      [msg],
      "Wormhole - Create Wrapped",
      [feeDenom]
    );
    dispatch(
      setCreateTx({ id: result.result.txhash, block: result.result.height })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

export function useHandleCreateWrapped(shouldUpdate: boolean) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const targetChain = useSelector(selectAttestTargetChain);
  const signedVAA = useAttestSignedVAA();
  const isCreating = useSelector(selectAttestIsCreating);
  const { signer } = useEthereumProvider();
  const terraWallet = useConnectedWallet();
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const handleCreateClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && !!signedVAA) {
      evm(
        dispatch,
        enqueueSnackbar,
        signer,
        signedVAA,
        targetChain,
        shouldUpdate
      );
    } else if (targetChain === CHAIN_ID_TERRA && !!terraWallet && !!signedVAA) {
      terra(
        dispatch,
        enqueueSnackbar,
        terraWallet,
        signedVAA,
        shouldUpdate,
        terraFeeDenom
      );
    } else {
      // enqueueSnackbar(
      //   "Creating wrapped tokens on this chain is not yet supported",
      //   {
      //     variant: "error",
      //   }
      // );
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    terraWallet,
    signedVAA,
    signer,
    shouldUpdate,
    terraFeeDenom,
  ]);
  return useMemo(
    () => ({
      handleClick: handleCreateClick,
      disabled: !!isCreating,
      showLoader: !!isCreating,
    }),
    [handleCreateClick, isCreating]
  );
}

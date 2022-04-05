import React from 'react'
import {
  attestFromEth,
  attestFromTerra,
  ChainId,
  CHAIN_ID_TERRA,
  getEmitterAddressEth,
  getEmitterAddressTerra,
  isEVMChain,
  parseSequenceFromLogEth,
  parseSequenceFromLogTerra,
  uint8ArrayToHex,
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
import {
  setAttestTx,
  setIsSending,
  setSignedVAAHex,
} from "src/store/attestSlice";
import {
  selectAttestIsSendComplete,
  selectAttestIsSending,
  selectAttestIsTargetComplete,
  selectAttestSourceAsset,
  selectAttestSourceChain,
  selectTerraFeeDenom,
} from "src/store/selectors";
import {
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  TERRA_TOKEN_BRIDGE_ADDRESS,
} from "src/utils/bridgeUtils/consts";
import { getSignedVAAWithRetry } from "src/utils/bridgeUtils/getSignedVAAWithRetry";
import parseError from "src/utils/bridgeUtils/parseError";
import { postWithFees, waitForTerraExecution } from "src/utils/bridgeUtils/terra";

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  sourceAsset: string,
  chainId: ChainId
) {
  dispatch(setIsSending(true));
  try {
    const receipt = await attestFromEth(
      getTokenBridgeAddressForChain(chainId),
      signer,
      sourceAsset
    );
    dispatch(
      setAttestTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogEth(
      receipt,
      getBridgeAddressForChain(chainId)
    );
    const emitterAddress = getEmitterAddressEth(
      getTokenBridgeAddressForChain(chainId)
    );
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      chainId,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: ConnectedWallet,
  asset: string,
  feeDenom: string
) {
  dispatch(setIsSending(true));
  try {
    const msg = await attestFromTerra(
      TERRA_TOKEN_BRIDGE_ADDRESS,
      wallet.terraAddress,
      asset
    );
    const result = await postWithFees(wallet, [msg], "Create Wrapped", [
      feeDenom,
    ]);
    const info = await waitForTerraExecution(result);
    dispatch(setAttestTx({ id: info.txhash, block: info.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogTerra(info);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressTerra(
      TERRA_TOKEN_BRIDGE_ADDRESS
    );
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      CHAIN_ID_TERRA,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
  }
}

export function useHandleAttest() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const sourceChain = useSelector(selectAttestSourceChain);
  const sourceAsset = useSelector(selectAttestSourceAsset);
  const isTargetComplete = useSelector(selectAttestIsTargetComplete);
  const isSending = useSelector(selectAttestIsSending);
  const isSendComplete = useSelector(selectAttestIsSendComplete);
  const { signer } = useEthereumProvider();
  const terraWallet = useConnectedWallet();
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const disabled = !isTargetComplete || isSending || isSendComplete;
  const handleAttestClick = useCallback(() => {
    if (isEVMChain(sourceChain) && !!signer) {
      evm(dispatch, enqueueSnackbar, signer, sourceAsset, sourceChain);
    } else if (sourceChain === CHAIN_ID_TERRA && !!terraWallet) {
      terra(dispatch, enqueueSnackbar, terraWallet, sourceAsset, terraFeeDenom);
    } else {
    }
  }, [
    dispatch,
    enqueueSnackbar,
    sourceChain,
    signer,
    terraWallet,
    sourceAsset,
    terraFeeDenom,
  ]);
  return useMemo(
    () => ({
      handleClick: handleAttestClick,
      disabled,
      showLoader: isSending,
    }),
    [handleAttestClick, disabled, isSending]
  );
}

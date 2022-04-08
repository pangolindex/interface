import {
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_FANTOM,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_TERRA,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import {
  Checkbox,
  FormControlLabel,
  Link,
} from "@material-ui/core";
import React,{ useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetIsTransferCompleted from "src/hooks/bridgeHooks/useGetIsTransferCompleted";
import { useHandleRedeem } from "src/hooks/bridgeHooks/useHandleRedeem";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import {
  selectTransferIsRecovery,
  selectTransferTargetAsset,
  selectTransferTargetChain,
} from "src/store/selectors";
import { reset } from "src/store/transferSlice";
import {
  getHowToAddTokensToWalletUrl,
  ROPSTEN_WETH_ADDRESS,
  WAVAX_ADDRESS,
  WBNB_ADDRESS,
  WETH_ADDRESS,
  WFTM_ADDRESS,
  WMATIC_ADDRESS,
  WROSE_ADDRESS,
} from "src/utils/bridgeUtils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import KeyAndBalance from "../KeyAndBalance";
import SmartAddress from "../SmartAddress";
import StepDescription from "../StepDescription";
import TerraFeeDenomPicker from "../TerraFeeDenomPicker";
import AddToMetamask from "./AddToMetamask";
import WaitingForWalletMessage from "./WaitingForWalletMessage";

function Redeem() {
  const { handleClick, handleNativeClick, disabled, showLoader } =
    useHandleRedeem();
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAsset = useSelector(selectTransferTargetAsset);
  const isRecovery = useSelector(selectTransferIsRecovery);
  const { isTransferCompletedLoading, isTransferCompleted } =
    useGetIsTransferCompleted(true);
  const dispatch = useDispatch();
  const { isReady, statusMessage } = useIsWalletReady(targetChain);
  //TODO better check, probably involving a hook & the VAA
  const isEthNative =
    targetChain === CHAIN_ID_ETH &&
    targetAsset &&
    targetAsset.toLowerCase() === WETH_ADDRESS.toLowerCase();
  const isEthRopstenNative =
    targetChain === CHAIN_ID_ETHEREUM_ROPSTEN &&
    targetAsset &&
    targetAsset.toLowerCase() === ROPSTEN_WETH_ADDRESS.toLowerCase();
  const isBscNative =
    targetChain === CHAIN_ID_BSC &&
    targetAsset &&
    targetAsset.toLowerCase() === WBNB_ADDRESS.toLowerCase();
  const isPolygonNative =
    targetChain === CHAIN_ID_POLYGON &&
    targetAsset &&
    targetAsset.toLowerCase() === WMATIC_ADDRESS.toLowerCase();
  const isAvaxNative =
    targetChain === CHAIN_ID_AVAX &&
    targetAsset &&
    targetAsset.toLowerCase() === WAVAX_ADDRESS.toLowerCase();
  const isOasisNative =
    targetChain === CHAIN_ID_OASIS &&
    targetAsset &&
    targetAsset.toLowerCase() === WROSE_ADDRESS.toLowerCase();
  const isFantomNative =
    targetChain === CHAIN_ID_FANTOM &&
    targetAsset &&
    targetAsset.toLowerCase() === WFTM_ADDRESS.toLowerCase();
  const isNativeEligible =
    isEthNative ||
    isEthRopstenNative ||
    isBscNative ||
    isPolygonNative ||
    isAvaxNative ||
    isOasisNative ||
    isFantomNative;
  const [useNativeRedeem, setUseNativeRedeem] = useState(true);
  const toggleNativeRedeem = useCallback(() => {
    setUseNativeRedeem(!useNativeRedeem);
  }, [useNativeRedeem]);
  const handleResetClick = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);
  const howToAddTokensUrl = getHowToAddTokensToWalletUrl(targetChain);

  return (
    <>
      <StepDescription>Receive the tokens on the target chain</StepDescription>
      <KeyAndBalance chainId={targetChain} />
      {targetChain === CHAIN_ID_TERRA && (
        <TerraFeeDenomPicker disabled={disabled} />
      )}
      {isNativeEligible && (
        <FormControlLabel
          control={
            <Checkbox
              checked={useNativeRedeem}
              onChange={toggleNativeRedeem}
              color="primary"
            />
          }
          label="Automatically unwrap to native currency"
        />
      )}

      <ButtonWithLoader
        //TODO disable when the associated token account is confirmed to not exist
        disabled={
          !isReady ||
          disabled ||
          (isRecovery && (isTransferCompletedLoading || isTransferCompleted))
        }
        onClick={
          isNativeEligible && useNativeRedeem ? handleNativeClick : handleClick
        }
        showLoader={showLoader || (isRecovery && isTransferCompletedLoading)}
        error={statusMessage}
      >
        Redeem
      </ButtonWithLoader>
      <WaitingForWalletMessage />

      {isRecovery && isReady && isTransferCompleted ? (
        <>
          <div style={{marginTop: "20px", marginBottom: "20px", color: "red"}}>
            These tokens have already been redeemed.{" "}
            {!isEVMChain(targetChain) && howToAddTokensUrl ? (
              <Link
                href={howToAddTokensUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to see how to add them to your wallet.
              </Link>
            ) : null}
          </div>
          {targetAsset ? (
            <>
              <span>Token Address:</span>
              <SmartAddress
                chainId={targetChain}
                address={targetAsset || undefined}
              />
            </>
          ) : null}
          {isEVMChain(targetChain) ? <AddToMetamask /> : null}
          <ButtonWithLoader onClick={handleResetClick}>
            Transfer More Tokens!
          </ButtonWithLoader>
        </>
      ) : null}
    </>
  );
}

export default Redeem;

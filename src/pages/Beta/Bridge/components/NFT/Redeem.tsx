import React from "react";
import { CHAIN_ID_TERRA } from "@certusone/wormhole-sdk";
import { useSelector } from "react-redux";
import { useHandleNFTRedeem } from "src/hooks/bridgeHooks/useHandleNFTRedeem";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import { selectNFTTargetChain } from "src/store/selectors";
import ButtonWithLoader from "../ButtonWithLoader";
import KeyAndBalance from "../KeyAndBalance";
import StepDescription from "../StepDescription";
import TerraFeeDenomPicker from "../TerraFeeDenomPicker";
import WaitingForWalletMessage from "./WaitingForWalletMessage";

function Redeem() {
  const { handleClick, disabled, showLoader } = useHandleNFTRedeem();
  const targetChain = useSelector(selectNFTTargetChain);
  const { isReady, statusMessage } = useIsWalletReady(targetChain);
  return (
    <>
      <StepDescription>Receive the NFT on the target chain</StepDescription>
      <KeyAndBalance chainId={targetChain} />
      {targetChain === CHAIN_ID_TERRA && (
        <TerraFeeDenomPicker disabled={disabled} />
      )}
      <ButtonWithLoader
        disabled={!isReady || disabled}
        onClick={handleClick}
        showLoader={showLoader}
        error={statusMessage}
      >
        Redeem
      </ButtonWithLoader>
      <WaitingForWalletMessage />
    </>
  );
}

export default Redeem;

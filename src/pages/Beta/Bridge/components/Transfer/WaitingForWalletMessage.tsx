import React from "react";
import { useSelector } from "react-redux";
import {
  selectTransferIsApproving,
  selectTransferIsRedeeming,
  selectTransferIsSending,
  selectTransferRedeemTx,
  selectTransferTransferTx,
} from "src/store/selectors";
import { Text } from '@pangolindex/components'

export const WAITING_FOR_WALLET_AND_CONF =
  "Waiting for wallet approval (likely in a popup) and confirmation...";

export default function WaitingForWalletMessage() {
  const isApproving = useSelector(selectTransferIsApproving);
  const isSending = useSelector(selectTransferIsSending);
  const transferTx = useSelector(selectTransferTransferTx);
  const isRedeeming = useSelector(selectTransferIsRedeeming);
  const redeemTx = useSelector(selectTransferRedeemTx);
  const showWarning =
    isApproving || (isSending && !transferTx) || (isRedeeming && !redeemTx);
  return showWarning ? (
    <Text fontSize={15} fontWeight={500} lineHeight="20px" color="primaryText1" style={{ textAlign: "center", marginTop: "10px" }}>
      {WAITING_FOR_WALLET_AND_CONF}{" "}
    </Text>
  ) : null;
}

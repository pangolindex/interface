import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectTransferIsApproving,
  selectTransferIsRedeeming,
  selectTransferIsSending,
  selectTransferRedeemTx,
  selectTransferTransferTx,
} from "src/store/selectors";

const useStyles = makeStyles((theme) => ({
  message: {
    color: theme.palette.warning.light,
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
}));

export const WAITING_FOR_WALLET_AND_CONF =
  "Waiting for wallet approval (likely in a popup) and confirmation...";

export default function WaitingForWalletMessage() {
  const classes = useStyles();
  const isApproving = useSelector(selectTransferIsApproving);
  const isSending = useSelector(selectTransferIsSending);
  const transferTx = useSelector(selectTransferTransferTx);
  const isRedeeming = useSelector(selectTransferIsRedeeming);
  const redeemTx = useSelector(selectTransferRedeemTx);
  const showWarning =
    isApproving || (isSending && !transferTx) || (isRedeeming && !redeemTx);
  return showWarning ? (
    <Typography className={classes.message} variant="body2">
      {WAITING_FOR_WALLET_AND_CONF}{" "}
    </Typography>
  ) : null;
}

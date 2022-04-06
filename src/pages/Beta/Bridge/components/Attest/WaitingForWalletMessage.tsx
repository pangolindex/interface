import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectAttestAttestTx,
  selectAttestCreateTx,
  selectAttestIsCreating,
  selectAttestIsSending,
} from "src/store/selectors";
import { WAITING_FOR_WALLET_AND_CONF } from "../Transfer/WaitingForWalletMessage";

const useStyles = makeStyles((theme) => ({
  message: {
    color: theme.palette.warning.light,
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
}));

export default function WaitingForWalletMessage() {
  const classes = useStyles();
  const isSending = useSelector(selectAttestIsSending);
  const attestTx = useSelector(selectAttestAttestTx);
  const isCreating = useSelector(selectAttestIsCreating);
  const createTx = useSelector(selectAttestCreateTx);
  const showWarning = (isSending && !attestTx) || (isCreating && !createTx);
  return showWarning ? (
    <Typography style={{color: 'white'}} className={classes.message} variant="body2">
      {WAITING_FOR_WALLET_AND_CONF}{" "}
    </Typography>
  ) : null;
}

import React from 'react'
import { ChainId, CHAIN_ID_TERRA } from "@certusone/wormhole-sdk";
import { makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import useTransactionFees from "src/hooks/bridgeHooks/useTransactionFees";
import { getDefaultNativeCurrencySymbol } from "src/utils/bridgeUtils/consts";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function LowBalanceWarning({ chainId }: { chainId: ChainId }) {
  const classes = useStyles();
  const { isReady } = useIsWalletReady(chainId);
  const transactionFeeWarning = useTransactionFees(chainId);
  const displayWarning =
    isReady &&
    (chainId === CHAIN_ID_TERRA || transactionFeeWarning.balanceString) &&
    transactionFeeWarning.isSufficientBalance === false;

  const warningMessage =
    chainId === CHAIN_ID_TERRA
      ? "This wallet may not have sufficient funds to pay for the upcoming transaction fees."
      : `This wallet has a very low ${getDefaultNativeCurrencySymbol(
          chainId
        )} balance and may not be able to pay for the upcoming transaction fees.`;

  const content = (
    <Alert severity="warning" variant="outlined" className={classes.alert}>
      <Typography variant="body1">{warningMessage}</Typography>
      {chainId !== CHAIN_ID_TERRA ? (
        <Typography style={{color: 'white'}} variant="body1">
          {"Current balance: " + transactionFeeWarning.balanceString}
        </Typography>
      ) : null}
    </Alert>
  );

  return displayWarning ? content : null;
}

export default LowBalanceWarning;
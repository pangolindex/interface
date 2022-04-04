import React from 'react'
import { makeStyles } from "@material-ui/core";
import DisconnectIcon from "@material-ui/icons/LinkOff";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-material-ui";
import { useSolanaWallet } from "src/contexts/SolanaWalletContext";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    margin: `${theme.spacing(1)}px auto`,
    width: "100%",
    maxWidth: 400,
  },
  disconnectButton: {
    marginLeft: theme.spacing(1),
  },
}));

const SolanaWalletKey = () => {
  const classes = useStyles();
  const wallet = useSolanaWallet();
  return (
    <div className={classes.root}>
      <WalletMultiButton style={{backgroundColor: "#FFC800", color: "black"}} />
      {wallet && (
        <WalletDisconnectButton
          startIcon={<DisconnectIcon />}
          className={classes.disconnectButton}
          style={{backgroundColor: "#FF0000", color: "black"}}
        />
      )}
    </div>
  );
};

export default SolanaWalletKey;

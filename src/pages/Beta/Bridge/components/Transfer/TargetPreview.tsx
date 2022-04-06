import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";
import { useTargetInfo } from "./Target";

const useStyles = makeStyles((theme) => ({
  description: {
    textAlign: "center",
  },
}));

export default function TargetPreview() {
  const classes = useStyles();
  const {
    targetChain,
    readableTargetAddress,
    targetAsset,
    symbol,
    tokenName,
    logo,
  } = useTargetInfo();

  const explainerContent =
    targetChain && readableTargetAddress ? (
      <div style={{padding: '10px'}}>
        {targetAsset ? (
          <>
            <span style={{color: 'white'}}>and receive</span>
            <SmartAddress
              chainId={targetChain}
              address={targetAsset}
              symbol={symbol}
              tokenName={tokenName}
              logo={logo}
            />
          </>
        ) : null}
        <span style={{color: 'white'}}>to</span>
        <SmartAddress chainId={targetChain} address={readableTargetAddress} />
        <span style={{color: 'white'}}>on {CHAINS_BY_ID[targetChain].name}</span>
      </div>
    ) : (
      ""
    );

  return (
    <Typography
      component="div"
      variant="subtitle2"
      className={classes.description}
    >
      {explainerContent}
    </Typography>
  );
}

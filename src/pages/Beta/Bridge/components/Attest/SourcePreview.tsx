import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectAttestSourceAsset,
  selectAttestSourceChain,
} from "src/store/selectors";
import { CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";

const useStyles = makeStyles((theme) => ({
  description: {
    textAlign: "center",
  },
}));

export default function SourcePreview() {
  const classes = useStyles();
  const sourceChain = useSelector(selectAttestSourceChain);
  const sourceAsset = useSelector(selectAttestSourceAsset);

  const explainerContent =
    sourceChain && sourceAsset ? (
      <>
        <span>You will attest</span>
        <SmartAddress chainId={sourceChain} address={sourceAsset} />
        <span>on {CHAINS_BY_ID[sourceChain].name}</span>
      </>
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

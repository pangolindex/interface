import React from "react";
import {
  ChainId,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";
import { getAddress } from "@ethersproject/address";
import { Container, makeStyles, Paper, Typography } from "@material-ui/core";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { COLORS } from "../../muiTheme";
import { getMigrationAssetMap } from "src/utils/bridgeUtils/consts";
import HeaderText from "../HeaderText";
import EvmWorkflow from "./EvmWorkflow";

const useStyles = makeStyles(() => ({
  mainPaper: {
    backgroundColor: COLORS.whiteWithTransparency,
    textAlign: "center",
    padding: "2rem",
    "& > h, p ": {
      margin: ".5rem",
    },
  },
  divider: {
    margin: "2rem 0rem 2rem 0rem",
  },
  spacer: {
    height: "2rem",
  },
}));

interface RouteParams {
  legacyAsset: string;
  fromTokenAccount: string;
}

interface Migration extends RouteComponentProps<RouteParams> {
  chainId: ChainId;
}

const EthereumRoot: React.FC<Migration> = (props) => {
  const legacyAsset: string = props.match.params.legacyAsset;
  const assetMap = getMigrationAssetMap(props.chainId);
  const targetPool = assetMap.get(getAddress(legacyAsset));

  let content = null;
  if (!legacyAsset || !targetPool) {
    content = (
      <Typography style={{ textAlign: "center", color: 'white' }}>
        This asset is not eligible for migration.
      </Typography>
    );
  } else {
    content = (
      <EvmWorkflow migratorAddress={targetPool} chainId={props.chainId} />
    );
  }

  return content;
};

const MigrationRoot: React.FC<Migration> = (props) => {
  const classes = useStyles();
  let content = null;

  if (props.chainId === CHAIN_ID_ETH || props.chainId === CHAIN_ID_BSC) {
    content = <EthereumRoot {...props} />;
  }

  return (
    <Container maxWidth="md">
      <HeaderText
        white
        subtitle="Convert assets from other bridges to Wormhole V2 tokens"
      >
        Migrate Assets
      </HeaderText>
      <Paper className={classes.mainPaper}>{content}</Paper>
    </Container>
  );
};

export default withRouter(MigrationRoot);
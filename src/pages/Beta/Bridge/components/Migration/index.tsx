import React from "react";
import {
  ChainId,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";
import { getAddress } from "@ethersproject/address";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { getMigrationAssetMap } from "src/utils/bridgeUtils/consts";
import EvmWorkflow from "./EvmWorkflow";
import { Text } from '@pangolindex/components'

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
      <Text fontSize={15} fontWeight={500} lineHeight="20px" color="text10" style={{ textAlign: "center", color: 'white' }}>
        This asset is not eligible for migration.
      </Text>
    );
  } else {
    content = (
      <EvmWorkflow migratorAddress={targetPool} chainId={props.chainId} />
    );
  }

  return content;
};

const MigrationRoot: React.FC<Migration> = (props) => {
  let content = null;

  if (props.chainId === CHAIN_ID_ETH || props.chainId === CHAIN_ID_BSC) {
    content = <EthereumRoot {...props} />;
  }

  return (
    <>
      <Text fontSize={30} fontWeight={500} lineHeight="20px" color="text10" style={{ color: 'white' }}>
        Migrate Assets
      </Text>
      <div style={{textAlign: "center", padding: "2rem",}}>{content}</div>
    </>
  );
};

export default withRouter(MigrationRoot);

import React from "react";
import { ChainId, CHAIN_ID_POLYGON, isEVMChain } from "@certusone/wormhole-sdk";
import { POLYGON_TERRA_WRAPPED_TOKENS } from "src/utils/bridgeUtils/consts";
import { Text } from '@pangolindex/components'


function PolygonTerraWrappedWarning() {
  return (
    <div style={{ border: '1px solid #6DA8FF', padding: '15px', margin: '15px' }}>
      <Text fontSize={17} fontWeight={300} lineHeight="20px" color="primaryText1">
        This is a Shuttle-wrapped asset from Polygon! Transferring it will
        result in a double wrapped (Wormhole-wrapped Shuttle-wrapped) asset,
        which has no liquid markets.
      </Text>
    </div>
  );
}

export default function SoureAssetWarning({
  sourceChain,
  sourceAsset,
}: {
  sourceChain?: ChainId;
  sourceAsset?: string;
  originChain?: ChainId;
  targetChain?: ChainId;
  targetAsset?: string;
}) {
  if (!(sourceChain && sourceAsset)) {
    return null;
  }

  const searchableAddress = isEVMChain(sourceChain)
    ? sourceAsset.toLowerCase()
    : sourceAsset;
  const showPolygonTerraWrappedWarning =
    sourceChain === CHAIN_ID_POLYGON &&
    POLYGON_TERRA_WRAPPED_TOKENS.includes(searchableAddress);

  return (
    <>
      {showPolygonTerraWrappedWarning ? <PolygonTerraWrappedWarning /> : null}
    </>
  );
}

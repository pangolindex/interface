import React from 'react'
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import ToggleConnectedButton from "./ToggleConnectedButton";
import { Text } from "@pangolindex/components"
const EthereumSignerKey = () => {
  const { connect, disconnect, signerAddress, providerError } =
    useEthereumProvider();
  return (
    <>
      <ToggleConnectedButton
        connect={connect}
        disconnect={disconnect}
        connected={!!signerAddress}
        pk={signerAddress || ""}
      />
      {providerError ? (
        <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >
          {providerError}
        </Text>
      ) : null}
    </>
  );
};

export default EthereumSignerKey;

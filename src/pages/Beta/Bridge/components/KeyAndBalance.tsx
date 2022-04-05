import React from 'react'
import {
  ChainId,
  CHAIN_ID_TERRA,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import EthereumSignerKey from "./EthereumSignerKey";
import TerraWalletKey from "./TerraWalletKey";

function KeyAndBalance({ chainId }: { chainId: ChainId }) {
  if (isEVMChain(chainId)) {
    return (
      <>
        <EthereumSignerKey />
      </>
    );
  }
  if (chainId === CHAIN_ID_TERRA) {
    return (
      <>
        <TerraWalletKey />
      </>
    );
  }
  return null;
}

export default KeyAndBalance;

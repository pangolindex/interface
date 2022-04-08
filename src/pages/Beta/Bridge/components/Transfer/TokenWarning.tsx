import React from "react";
import { ChainId, CHAIN_ID_ETH, isEVMChain } from "@certusone/wormhole-sdk";
import {
  AVAILABLE_MARKETS_URL,
  CHAINS_BY_ID,
  MULTI_CHAIN_TOKENS,
} from "src/utils/bridgeUtils/consts";
import { Text } from '@pangolindex/components'

function WormholeWrappedWarning() {
  return (
    <div style={{border: "1px solid #6DA8FF", padding: '15px', marginBottom: '10px'}}>
      <Text fontSize={15} fontWeight={300} lineHeight="20px" color="primaryText1" >
        The tokens you will receive are{" "}
        <Text fontSize={15} fontWeight={5000} lineHeight="20px" color="primaryText1" >
          Wormhole Wrapped Tokens
        </Text>{" "}
        and will need to be exchanged for native assets.
      </Text>
      <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
        <a
          href={AVAILABLE_MARKETS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{color: 'white'}}
        >
          Click here to see available markets for wrapped tokens.
        </a>
      </Text>
    </div>
  );
}

function MultichainWarning({
  symbol,
  targetChain,
}: {
  symbol: string;
  targetChain: ChainId;
}) {
  return (
    <div style={{border: "1px solid #6DA8FF", padding: '15px', margin: '15px'}}>
      <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
        {`You will not receive native ${symbol} on ${CHAINS_BY_ID[targetChain].name}`}
      </Text>
      <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
        {`To receive native ${symbol}, you will have to perform a swap with the wrapped tokens once you are done bridging.`}
      </Text>
      <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
        <a
          href={AVAILABLE_MARKETS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here to see available markets for wrapped tokens.
        </a>
      </Text>
    </div>
  );
}

function RewardsWarning() {
  return (
    <div style={{border: "1px solid #6DA8FF", padding: '15px', margin: '15px'}}>
      Lido stETH rewards can only be received on Ethereum. Use the value
      accruing wrapper token wstETH instead.
    </div>
  );
}

export default function TokenWarning({
  sourceChain,
  sourceAsset,
  originChain,
  targetChain,
  targetAsset,
}: {
  sourceChain?: ChainId;
  sourceAsset?: string;
  originChain?: ChainId;
  targetChain?: ChainId;
  targetAsset?: string;
}) {
  if (
    !(originChain && targetChain && targetAsset && sourceChain && sourceAsset)
  ) {
    return null;
  }

  const searchableAddress = isEVMChain(sourceChain)
    ? sourceAsset.toLowerCase()
    : sourceAsset;
  const isWormholeWrapped = originChain !== targetChain;
  const multichainSymbol =
    MULTI_CHAIN_TOKENS[sourceChain]?.[searchableAddress] || undefined;
  const isMultiChain = !!multichainSymbol;
  const isRewardsToken =
    searchableAddress === "0xae7ab96520de3a18e5e111b5eaab095312d7fe84" &&
    sourceChain === CHAIN_ID_ETH;

  const showMultiChainWarning = isMultiChain && isWormholeWrapped;
  const showWrappedWarning = !isMultiChain && isWormholeWrapped; //Multichain warning is more important
  const showRewardsWarning = isRewardsToken;

  return (
    <>
      {showMultiChainWarning ? (
        <MultichainWarning
          symbol={multichainSymbol || "tokens"}
          targetChain={targetChain}
        />
      ) : null}
      {showWrappedWarning ? <WormholeWrappedWarning /> : null}
      {showRewardsWarning ? <RewardsWarning /> : null}
    </>
  );
}

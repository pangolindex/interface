import React from "react";
import { TokenInfo } from "@solana/spl-token-registry";
import { useSelector } from "react-redux";
import useMarketsMap from "src/hooks/bridgeHooks/useMarketsMap";
import { DataWrapper } from "src/store/helpers";
import {
  selectSolanaTokenMap,
  selectTransferSourceAsset,
  selectTransferSourceChain,
  selectTransferTargetAsset,
  selectTransferTargetChain,
} from "src/store/selectors";
import { JUPITER_SWAP_BASE_URL } from "src/utils/bridgeUtils/consts";
import { Text, Button } from "@pangolindex/components"

function getJupiterSwapUrl(
  link: string,
  targetAsset: string,
  tokenMap: DataWrapper<TokenInfo[]>
) {
  if (!tokenMap.error && !tokenMap.isFetching && tokenMap.data) {
    const tokenInfo = tokenMap.data.find((value) => {
      return value.address === targetAsset;
    });
    if (tokenInfo) {
      const sourceSymbol = tokenInfo.symbol;
      if (sourceSymbol) {
        const targetSymbol = sourceSymbol === "UST" ? "SOL" : "UST";
        return `${JUPITER_SWAP_BASE_URL}/${sourceSymbol}-${targetSymbol}`;
      }
    }
  }
  return link;
}

export default function FeaturedMarkets() {
  const sourceChain = useSelector(selectTransferSourceChain);
  const sourceAsset = useSelector(selectTransferSourceAsset);
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAsset = useSelector(selectTransferTargetAsset);
  const solanaTokenMap = useSelector(selectSolanaTokenMap);
  const { data: marketsData } = useMarketsMap(true);

  if (
    !sourceAsset ||
    !targetAsset ||
    !marketsData ||
    !marketsData.markets ||
    !marketsData.tokenMarkets
  ) {
    return null;
  }

  const tokenMarkets =
    marketsData.tokenMarkets[sourceChain]?.[targetChain]?.[sourceAsset];
  if (!tokenMarkets) {
    return null;
  }

  const tokenMarketButtons = [];
  for (const market of tokenMarkets.markets) {
    const marketInfo = marketsData.markets[market];
    if (marketInfo) {
      const url =
        market === "jupiter"
          ? getJupiterSwapUrl(marketInfo.link, sourceAsset, solanaTokenMap)
          : marketInfo.link;
      tokenMarketButtons.push(
        <Button
        variant="outline"
        height={36}
        padding="4px 6px"
        href={url}
        as="a"
        target=""
      >
        {marketInfo.name}
      </Button>
      );
    }
  }

  return tokenMarketButtons.length ? (
    <div style={{ textAlign: "center" }}>
      <Text fontSize={20} fontWeight={500} lineHeight="12px" color="primaryText1">
        Featured markets
      </Text>
      {tokenMarketButtons}
    </div>
  ) : null;
}

import { useEffect, useState } from "react";
import { ChainId } from "@certusone/wormhole-sdk";
import axios from "axios";
import {
  DataWrapper,
  errorDataWrapper,
  fetchDataWrapper,
  receiveDataWrapper,
} from "src/store/helpers";
import { COIN_GECKO_IMAGE_URLS } from "src/utils/bridgeUtils/coinGecko";
import { CHAINS_BY_ID, TVL_URL } from "src/utils/bridgeUtils/consts";

export type TVL = {
  logo?: string;
  symbol?: string;
  name?: string;
  amount: string;
  totalValue?: number;
  quotePrice?: number;
  assetAddress: string;
  originChainId: ChainId;
  originChain: string;
  decimals?: number;
};

interface LockedAsset {
  Symbol: string;
  Name: string;
  Address: string;
  CoinGeckoId: string;
  Amount: number;
  Notional: number;
  TokenPrice: number;
}

interface LockedAssets {
  [tokenAddress: string]: LockedAsset;
}

interface ChainsAssets {
  [chainId: string]: LockedAssets;
}

interface NotionalTvl {
  Last24HoursChange: ChainsAssets;
  AllTime: ChainsAssets;
}

const createTVLArray = (notionalTvl: NotionalTvl) => {
  const tvl: TVL[] = [];
  for (const [chainId, chainAssets] of Object.entries(notionalTvl.AllTime)) {
    if (chainId === "*") continue;
    const originChainId = +chainId as ChainId;
    const originChain = CHAINS_BY_ID[originChainId].name;
    for (const [tokenAddress, lockedAsset] of Object.entries(chainAssets)) {
      if (tokenAddress === "*") continue;
      tvl.push({
        logo: COIN_GECKO_IMAGE_URLS[lockedAsset.CoinGeckoId],
        symbol: lockedAsset.Symbol,
        name: lockedAsset.Name,
        amount: lockedAsset.Amount.toString(),
        totalValue: lockedAsset.Notional,
        quotePrice: lockedAsset.TokenPrice,
        assetAddress: tokenAddress,
        originChainId,
        originChain,
      });
    }
  }
  return tvl;
};

const useTVL = () => {
  const [tvl, setTvl] = useState<DataWrapper<TVL[]>>(fetchDataWrapper());

  useEffect(() => {
    let cancelled = false;
    axios
      .get<NotionalTvl>(TVL_URL)
      .then((response) => {
        if (!cancelled) {
          setTvl(receiveDataWrapper(createTVLArray(response.data)));
        }
      })
      .catch((error) => {
        console.log(error);
        if (!cancelled) {
          setTvl(errorDataWrapper(error));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return tvl;
};

export default useTVL;
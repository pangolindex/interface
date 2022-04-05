import {
  ChainId,
  CHAIN_ID_TERRA,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { useMemo } from "react";
import { DataWrapper, getEmptyDataWrapper } from "src/store/helpers";
import { logoOverrides } from "src/utils/bridgeUtils/consts";
import useEvmMetadata, { EvmMetadata } from "./useEvmMetadata";
import useTerraMetadata, { TerraMetadata } from "./useTerraMetadata";
import useTerraTokenMap, { TerraTokenMap } from "./useTerraTokenMap";

export type GenericMetadata = {
  symbol?: string;
  logo?: string;
  tokenName?: string;
  decimals?: number;
  //TODO more items
  raw?: any;
};

const constructTerraMetadata = (
  addresses: string[],
  tokenMap: DataWrapper<TerraTokenMap>,
  terraMetadata: DataWrapper<Map<string, TerraMetadata>>
) => {
  const isFetching = tokenMap.isFetching || terraMetadata.isFetching;
  const error = tokenMap.error || terraMetadata.error;
  const receivedAt = tokenMap.receivedAt && terraMetadata.receivedAt;
  const data = new Map<string, GenericMetadata>();
  addresses.forEach((address) => {
    const metadata = terraMetadata.data?.get(address);
    const tokenInfo = tokenMap.data?.mainnet[address];
    const obj = {
      symbol: tokenInfo?.symbol || metadata?.symbol || undefined,
      logo: tokenInfo?.icon || metadata?.logo || undefined,
      tokenName: tokenInfo?.name || metadata?.tokenName || undefined,
      decimals: metadata?.decimals || undefined,
    };
    data.set(address, obj);
  });

  return {
    isFetching,
    error,
    receivedAt,
    data,
  };
};

const constructEthMetadata = (
  addresses: string[],
  metadataMap: DataWrapper<Map<string, EvmMetadata> | null>
) => {
  const isFetching = metadataMap.isFetching;
  const error = metadataMap.error;
  const receivedAt = metadataMap.receivedAt;
  const data = new Map<string, GenericMetadata>();
  addresses.forEach((address) => {
    const meta = metadataMap.data?.get(address);
    const obj = {
      symbol: meta?.symbol || undefined,
      logo: logoOverrides.get(address) || meta?.logo || undefined,
      tokenName: meta?.tokenName || undefined,
      decimals: meta?.decimals,
    };
    data.set(address, obj);
  });

  return {
    isFetching,
    error,
    receivedAt,
    data,
  };
};

export default function useMetadata(
  chainId: ChainId,
  addresses: string[]
): DataWrapper<Map<string, GenericMetadata>> {
  const terraTokenMap = useTerraTokenMap(chainId === CHAIN_ID_TERRA);

  const terraAddresses = useMemo(() => {
    return chainId === CHAIN_ID_TERRA ? addresses : [];
  }, [chainId, addresses]);
  const ethereumAddresses = useMemo(() => {
    return isEVMChain(chainId) ? addresses : [];
  }, [chainId, addresses]);

  const terraMetadata = useTerraMetadata(terraAddresses);
  const ethMetadata = useEvmMetadata(ethereumAddresses, chainId);

  const output: DataWrapper<Map<string, GenericMetadata>> = useMemo(
    () =>
        isEVMChain(chainId)
        ? constructEthMetadata(ethereumAddresses, ethMetadata)
        : chainId === CHAIN_ID_TERRA
        ? constructTerraMetadata(terraAddresses, terraTokenMap, terraMetadata)
        : getEmptyDataWrapper(),
    [
      chainId,
      ethereumAddresses,
      ethMetadata,
      terraAddresses,
      terraMetadata,
      terraTokenMap,
    ]
  );

  return output;
}

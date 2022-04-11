import {
  CHAIN_ID_AVAX,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_TERRA,
} from "@certusone/wormhole-sdk";
import React, { useMemo } from "react";
import {
  getNFTBridgeAddressForChain,
  getTokenBridgeAddressForChain,
} from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";
import MuiReactTable from "./tableComponents/MuiReactTable";
import { Text } from '@pangolindex/components'

const CustodyAddresses: React.FC<any> = () => {
  const data = useMemo(() => {
    return [
      {
        chainName: "Ethereum",
        chainId: CHAIN_ID_ETH,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_ETH),
        nftAddress: getNFTBridgeAddressForChain(CHAIN_ID_ETH),
      },
      {
        chainName: "Terra",
        chainId: CHAIN_ID_TERRA,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_TERRA),
        nftAddress: null,
      },
      {
        chainName: "Polygon",
        chainId: CHAIN_ID_POLYGON,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_POLYGON),
        nftAddress: getNFTBridgeAddressForChain(CHAIN_ID_POLYGON),
      },
      {
        chainName: "Avalanche",
        chainId: CHAIN_ID_AVAX,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_AVAX),
        nftAddress: getNFTBridgeAddressForChain(CHAIN_ID_AVAX),
      },
      {
        chainName: "Oasis",
        chainId: CHAIN_ID_OASIS,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_OASIS),
        nftAddress: getNFTBridgeAddressForChain(CHAIN_ID_OASIS),
      },
      {
        chainName: "Fantom",
        chainId: CHAIN_ID_FANTOM,
        tokenAddress: getTokenBridgeAddressForChain(CHAIN_ID_FANTOM),
        nftAddress: getNFTBridgeAddressForChain(CHAIN_ID_FANTOM),
      },
    ];
  }, []);

  const tvlColumns = useMemo(() => {
    return [
      { Header: "Chain", accessor: "chainName", disableGroupBy: true },
      {
        Header: "Token Address",
        id: "tokenAddress",
        accessor: "address",
        disableGroupBy: true,
        Cell: (value: any) =>
          value.row?.original?.tokenAddress && value.row?.original?.chainId ? (
            <SmartAddress
              chainId={value.row?.original?.chainId}
              address={value.row?.original?.tokenAddress}
            />
          ) : (
            ""
          ),
      },
      {
        Header: "NFT Address",
        id: "nftAddress",
        accessor: "address",
        disableGroupBy: true,
        Cell: (value: any) =>
          value.row?.original?.nftAddress && value.row?.original?.chainId ? (
            <SmartAddress
              chainId={value.row?.original?.chainId}
              address={value.row?.original?.nftAddress}
            />
          ) : (
            ""
          ),
      },
    ];
  }, []);

  const header = (
    <div style={{display: "flex", alignItems: "flex-end", marginBottom: '15px', textAlign: "left" }}>
      <div style={{ padding: "2rem" }}>
        <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">Custody Addresses</Text>
        <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">
          These are the custody addresses which hold collateralized assets for
          the token bridge.
        </Text>
      </div>
      <div style={{flexGrow: 1}} />
    </div>
  );

  const table = (
    <MuiReactTable
      columns={tvlColumns}
      data={data || []}
      skipPageReset={false}
      initialState={{}}
    />
  );

  return (
    <>
      {header}
      <div style={{ padding: "2rem" }}>{table}</div>
    </>
  );
};

export default CustodyAddresses;

import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import numeral from "numeral";
import React, { useMemo } from "react";
import useTVL from "src/hooks/bridgeHooks/useTVL";
import HeaderText from "../HeaderText";
import SmartAddress from "../SmartAddress";
import { balancePretty } from "../TokenSelectors/TokenPicker";
import CustodyAddresses from "./CustodyAddresses";
import MuiReactTable from "./tableComponents/MuiReactTable";
import TransactionMetrics from "./TransactionMetrics";
import { Text } from '@pangolindex/components'

const StatsRoot: React.FC<any> = () => {
  const tvl = useTVL();

  const sortTokens = useMemo(() => {
    return (rowA: any, rowB: any) => {
      if (rowA.isGrouped && rowB.isGrouped) {
        return rowA.values.assetAddress > rowB.values.assetAddress ? 1 : -1;
      } else if (rowA.isGrouped && !rowB.isGrouped) {
        return 1;
      } else if (!rowA.isGrouped && rowB.isGrouped) {
        return -1;
      } else if (rowA.original.symbol && !rowB.original.symbol) {
        return 1;
      } else if (rowB.original.symbol && !rowA.original.symbol) {
        return -1;
      } else if (rowA.original.symbol && rowB.original.symbol) {
        return rowA.original.symbol > rowB.original.symbol ? 1 : -1;
      } else {
        return rowA.original.assetAddress > rowB.original.assetAddress ? 1 : -1;
      }
    };
  }, []);
  const tvlColumns = useMemo(() => {
    return [
      {
        Header: "Token",
        id: "assetAddress",
        sortType: sortTokens,
        disableGroupBy: true,
        accessor: (value: any) => ({
          chainId: value.originChainId,
          symbol: value.symbol,
          name: value.name,
          logo: value.logo,
          assetAddress: value.assetAddress,
        }),
        aggregate: (leafValues: any) => leafValues.length,
        Aggregated: ({ value }: { value: any }) =>
          `${value} Token${value === 1 ? "" : "s"}`,
        Cell: (value: any) => (
          <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <div 
                style={{height: "30px",
                width: "30px",
                maxWidth: "30px",
                marginRight: '15px',
                display: "flex",
                alignItems: "center",}}>
              {value.row?.original?.logo ? (
                <img
                  src={value.row?.original?.logo}
                  alt=""
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : null}
            </div>
            <SmartAddress
              chainId={value.row?.original?.originChainId}
              address={value.row?.original?.assetAddress}
              symbol={value.row?.original?.symbol}
              tokenName={value.row?.original?.name}
            />
          </div>
        ),
      },
      { Header: "Chain", accessor: "originChain" },
      {
        Header: "Amount",
        accessor: "amount",
        align: "right",
        disableGroupBy: true,
        Cell: (value: any) =>
          value.row?.original?.amount !== undefined
            ? numeral(value.row?.original?.amount).format("0,0.00")
            : "",
      },
      {
        Header: "Total Value (USD)",
        id: "totalValue",
        accessor: "totalValue",
        align: "right",
        disableGroupBy: true,
        aggregate: (leafValues: any) =>
          balancePretty(
            formatUnits(
              leafValues.reduce(
                (p: BigNumber, v: number | null | undefined) =>
                  v ? p.add(parseUnits(v.toFixed(18).toString(), 18)) : p,
                BigNumber.from(0)
              ),
              18
            )
          ),
        Aggregated: ({ value }: { value: any }) => value,
        Cell: (value: any) =>
          value.row?.original?.totalValue !== undefined
            ? numeral(value.row?.original?.totalValue).format("0.0 a")
            : "",
      },
      {
        Header: "Unit Price (USD)",
        accessor: "quotePrice",
        align: "right",
        disableGroupBy: true,
        Cell: (value: any) =>
          value.row?.original?.quotePrice !== undefined
            ? numeral(value.row?.original?.quotePrice).format("0,0.00")
            : "",
      },
    ];
  }, [
    sortTokens,
  ]);
  const tvlString = useMemo(() => {
    if (!tvl.data) {
      return "";
    } else {
      let sum = 0;
      tvl.data.forEach((val) => {
        if (val.totalValue) sum += val.totalValue;
      });
      return numeral(sum)
        .format(sum >= 1000000000 ? "0.000 a" : "0 a")
        .toUpperCase();
    }
  }, [tvl.data]);

  return (
    <div>
      <div >
        <HeaderText white>Rock Hard Stats</HeaderText>
      </div>
      <div style={{display: "flex", alignItems: "flex-end", marginBottom: '20px',  textAlign: "left" }}>
        <div>
          <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">Total Value Locked</Text>
          <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">
          These assets are currently locked by the Token Bridge contracts.
          </Text>
        </div>
        <div style={{flexGrow: 1}}/>
        {!tvl.isFetching ? (
          <div
            style={{display: "flex", alignItems: "flex-end", paddingBottom: 1,}}
          >
            <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">
              {"Total (USD)"}
            </Text>
            <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white" style={{marginLeft: '10px', marginBottom: "-.125em"}}>
              {tvlString}
            </Text>
          </div>
        ) : null}
      </div>
      <div style={{ padding: "2rem", marginBottom: '15px' }}>
        {!tvl.isFetching ? (
          <MuiReactTable
            columns={tvlColumns}
            data={tvl.data}
            skipPageReset={false}
            initialState={{ sortBy: [{ id: "totalValue", desc: true }] }}
          />
        ) : (
          // <CircularProgress className={classes.alignCenter} />
          <></>
        )}
      </div>
      <TransactionMetrics />
      <CustodyAddresses />
    </div>
  );
};

export default StatsRoot;

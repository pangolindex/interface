import React from "react";
import numeral from "numeral";
import useTransactionCount from "src/hooks/bridgeHooks/useTransactionCount";
import { WORMHOLE_EXPLORER_BASE } from "src/utils/bridgeUtils/consts";
import { Text } from '@pangolindex/components'

const TransactionMetrics: React.FC<any> = () => {
  const transactionCount = useTransactionCount();
  const isFetching = transactionCount.isFetching;

  const header = (
    <div style={{ display: "flex", alignItems: "flex-end", marginBottom: '30px', textAlign: "left" }}>
      <div>
        <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">Transaction Count</Text>
        <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">
          This is how many transactions the Token Bridge has processed.
        </Text>
      </div>
      <div style={{flexGrow: 1}} />
    </div>
  );

  const content = (
    <div style={{ display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
      <div style={{paddingLeft: '15px', paddingRight: '15px', textAlign: "center", marginBottom: '20px' }}>
        <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white">
          {"Last 48 Hours"}
        </Text>
        <Text fontSize={22} fontWeight={600} lineHeight="20px" color="white">
          {numeral(transactionCount.data?.total48h || 0).format("0,0")}
        </Text>
      </div>
      <div style={{paddingLeft: '15px', paddingRight: '15px', textAlign: "center", marginBottom: '20px' }}>
        <Text fontSize={22} fontWeight={600} lineHeight="20px" color="white">
          {"All Time"}
        </Text>
        <Text fontSize={22} fontWeight={600} lineHeight="20px" color="white">
          {numeral(transactionCount.data?.totalAllTime || 0).format("0,0")}
        </Text>
      </div>
    </div>
  );

  const networkExplorer = (
    <Text fontSize={22} fontWeight={600} lineHeight="20px" color="white" style={{margin: "0 auto", display: "block", textAlign: "center",}}>
      To see metrics for the entire Wormhole Network (not just this bridge),
      check out the{" "} 
      <a href={WORMHOLE_EXPLORER_BASE} target="_blank" rel="noreferrer">
        Wormhole Network Explorer
      </a>
    </Text>
  );

  return (
    <>
      {header}
      <div style={{ padding: "2rem", marginBottom: "20px" }}>
        {isFetching ? (
          // <CircularProgress className={classes.alignCenter} />
          <></>
        ) : (
          <>
            {content}
            {networkExplorer}
          </>
        )}
      </div>
    </>
  );
};

export default TransactionMetrics;

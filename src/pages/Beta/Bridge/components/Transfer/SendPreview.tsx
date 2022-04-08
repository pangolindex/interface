import React from "react";
import { useSelector } from "react-redux";
import {
  selectTransferSourceChain,
  selectTransferTransferTx,
} from "src/store/selectors";
import ShowTx from "../ShowTx";
import { Text } from '@pangolindex/components'

export default function SendPreview() {
  const sourceChain = useSelector(selectTransferSourceChain);
  const transferTx = useSelector(selectTransferTransferTx);

  const explainerString = "";

  return (
    <>
      <Text fontSize={15} fontWeight={300} lineHeight="20px" color="white">
        {explainerString}
      </Text>
      {transferTx ? <ShowTx chainId={sourceChain} tx={transferTx} /> : null}
    </>
  );
}

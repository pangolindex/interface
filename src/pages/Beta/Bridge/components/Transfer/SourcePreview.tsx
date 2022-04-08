import React from "react";
import { useSelector } from "react-redux";
import {
  selectSourceWalletAddress,
  selectTransferAmount,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
} from "src/store/selectors";
import { CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";
import { Text } from "@pangolindex/components"

export default function SourcePreview() {
  const sourceChain = useSelector(selectTransferSourceChain);
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const sourceWalletAddress = useSelector(selectSourceWalletAddress);
  const sourceAmount = useSelector(selectTransferAmount);

  const explainerContent =
    sourceChain && sourceParsedTokenAccount ? (
      <>
        <span style={{color: 'white'}}>You will transfer {sourceAmount}</span>
        <SmartAddress
          chainId={sourceChain}
          parsedTokenAccount={sourceParsedTokenAccount}
        />
        {sourceWalletAddress ? (
          <>
            <span style={{color: 'white'}}>from</span>
            <SmartAddress chainId={sourceChain} address={sourceWalletAddress} />
          </>
        ) : null}
        <span>on {CHAINS_BY_ID[sourceChain].name}</span>
      </>
    ) : (
      ""
    );

  return (
    <>
      <Text fontSize={15} fontWeight={300} lineHeight="20px" color="white">
        {explainerContent}
      </Text>
    </>
  );
}

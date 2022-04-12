import React from 'react'
import { ChainId, CHAIN_ID_TERRA } from "@certusone/wormhole-sdk";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import useTransactionFees from "src/hooks/bridgeHooks/useTransactionFees";
import { getDefaultNativeCurrencySymbol } from "src/utils/bridgeUtils/consts";
import { Text } from "@pangolindex/components"

function LowBalanceWarning({ chainId }: { chainId: ChainId }) {
  const { isReady } = useIsWalletReady(chainId);
  const transactionFeeWarning = useTransactionFees(chainId);
  const displayWarning =
    isReady &&
    (chainId === CHAIN_ID_TERRA || transactionFeeWarning.balanceString) &&
    transactionFeeWarning.isSufficientBalance === false;

  const warningMessage =
    chainId === CHAIN_ID_TERRA
      ? "This wallet may not have sufficient funds to pay for the upcoming transaction fees."
      : `This wallet has a very low ${getDefaultNativeCurrencySymbol(
          chainId
        )} balance and may not be able to pay for the upcoming transaction fees.`;

  const content = (
    <div style={{margin: '20px 0 20px 0', border: '1px solid #E84142'}}>
      <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >{warningMessage}</Text>
      {chainId !== CHAIN_ID_TERRA ? (
        <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >
          {"Current balance: " + transactionFeeWarning.balanceString}
        </Text>
      ) : null}
    </div>
  );

  return displayWarning ? content : null;
}

export default LowBalanceWarning;

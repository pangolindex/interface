import {
  CHAIN_ID_TERRA,
  hexToNativeString,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetTargetParsedTokenAccounts from "src/hooks/bridgeHooks/useGetTargetParsedTokenAccounts";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import useSyncTargetAddress from "src/hooks/bridgeHooks/useSyncTargetAddress";
import { GasEstimateSummary } from "src/hooks/bridgeHooks/useTransactionFees";
import {
  selectTransferAmount,
  selectTransferIsTargetComplete,
  selectTransferShouldLockFields,
  selectTransferSourceChain,
  selectTransferTargetAddressHex,
  selectTransferTargetAsset,
  selectTransferTargetAssetWrapper,
  selectTransferTargetChain,
  selectTransferTargetError,
  selectTransferTargetParsedTokenAccount,
} from "src/store/selectors";
import { incrementStep, setTargetChain } from "src/store/transferSlice";
import { CHAINS, CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import ChainSelect from "../ChainSelect";
import KeyAndBalance from "../KeyAndBalance";
import LowBalanceWarning from "../LowBalanceWarning";
import SmartAddress from "../SmartAddress";
import RegisterNowButton from "./RegisterNowButton";
import { Text } from "@pangolindex/components"

export const useTargetInfo = () => {
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAddressHex = useSelector(selectTransferTargetAddressHex);
  const targetAsset = useSelector(selectTransferTargetAsset);
  const targetParsedTokenAccount = useSelector(
    selectTransferTargetParsedTokenAccount
  );
  const tokenName = targetParsedTokenAccount?.name;
  const symbol = targetParsedTokenAccount?.symbol;
  const logo = targetParsedTokenAccount?.logo;
  const readableTargetAddress =
    hexToNativeString(targetAddressHex, targetChain) || "";
  return useMemo(
    () => ({
      targetChain,
      targetAsset,
      tokenName,
      symbol,
      logo,
      readableTargetAddress,
    }),
    [targetChain, targetAsset, tokenName, symbol, logo, readableTargetAddress]
  );
};

function Target() {
  useGetTargetParsedTokenAccounts();
  const dispatch = useDispatch();
  const sourceChain = useSelector(selectTransferSourceChain);
  const chains = useMemo(
    () => CHAINS.filter((c) => c.id !== sourceChain),
    [sourceChain]
  );
  const { error: targetAssetError, data } = useSelector(
    selectTransferTargetAssetWrapper
  );
  const {
    targetChain,
    targetAsset,
    tokenName,
    symbol,
    logo,
    readableTargetAddress,
  } = useTargetInfo();
  const transferAmount = useSelector(selectTransferAmount);
  const error = useSelector(selectTransferTargetError);
  const isTargetComplete = useSelector(selectTransferIsTargetComplete);
  const shouldLockFields = useSelector(selectTransferShouldLockFields);
  const { statusMessage } = useIsWalletReady(targetChain);
  const isLoading = !statusMessage && !targetAssetError && !data;
  useSyncTargetAddress(!shouldLockFields);
  const handleTargetChange = useCallback(
    (event) => {
      dispatch(setTargetChain(event.target.value));
    },
    [dispatch]
  );
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep());
  }, [dispatch]);
  return (
    <>
      <span style={{color: 'white'}}>Select a recipient chain and address.</span>
      <ChainSelect
        variant="outlined"
        select
        fullWidth
        value={targetChain}
        onChange={handleTargetChange}
        disabled={true}
        chains={chains}
      />
      <KeyAndBalance chainId={targetChain} />
      {readableTargetAddress ? (
        <>
          {targetAsset ? (
            <div style={{marginTop: "20px"}}>
              <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white" >Bridged tokens:</Text>
              <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white" >
                <SmartAddress
                  chainId={targetChain}
                  address={targetAsset}
                  symbol={symbol}
                  tokenName={tokenName}
                  logo={logo}
                  variant="h6"
                />
                {`(Amount: ${transferAmount})`}
              </Text>
            </div>
          ) : null}
        </>
      ) : null}
      <div style={{ border: "solid 1px #6DA8FF", padding: '15px', margin: '15px' }}>
        <Text fontSize={15} fontWeight={200} lineHeight="20px" color="primaryText1" >
          You will have to pay transaction fees on{" "}
          {CHAINS_BY_ID[targetChain].name} to redeem your tokens.
        </Text>
        {(isEVMChain(targetChain) || targetChain === CHAIN_ID_TERRA) && (
          <GasEstimateSummary methodType="transfer" chainId={targetChain} />
        )}
      </div>
      <LowBalanceWarning chainId={targetChain} />
      <ButtonWithLoader
        disabled={!isTargetComplete}
        onClick={handleNextClick}
        showLoader={isLoading}
        error={
          statusMessage || (isLoading ? undefined : error || targetAssetError)
        }
      >
        Next
      </ButtonWithLoader>
      {!statusMessage && data && !data.doesExist ? <RegisterNowButton /> : null}
    </>
  );
}

export default Target;

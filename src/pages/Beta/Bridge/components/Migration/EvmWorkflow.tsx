import { ChainId } from "@certusone/wormhole-sdk";
import { parseUnits } from "ethers/lib/utils";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import useEthereumMigratorInformation from "src/hooks/bridgeHooks/useEthereumMigratorInformation";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import ButtonWithLoader from "../ButtonWithLoader";
import EthereumSignerKey from "../EthereumSignerKey";
import NumberTextField from "../NumberTextField";
import ShowTx from "../ShowTx";
import SmartAddress from "../SmartAddress";
import { Text } from '@pangolindex/components'

export default function EvmWorkflow({
  chainId,
  migratorAddress,
}: {
  chainId: ChainId;
  migratorAddress: string;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { signer, signerAddress } = useEthereumProvider();
  const { isReady } = useIsWalletReady(chainId);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const forceRefresh = useCallback(
    () => setToggleRefresh((prevState) => !prevState),
    []
  );
  const poolInfo = useEthereumMigratorInformation(
    migratorAddress,
    signer,
    signerAddress,
    toggleRefresh
  );
  const fromWalletBalance = poolInfo.data?.fromWalletBalance;

  const [migrationAmount, setMigrationAmount] = useState("");
  const [migrationIsProcessing, setMigrationIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [transaction, setTransaction] = useState<string | null>(null);

  const fromParse = (amount: string) => {
    try {
      if (!poolInfo.data?.fromDecimals || !migrationAmount) {
        return BigInt(0);
      }
      return parseUnits(amount, poolInfo.data.fromDecimals).toBigInt();
    } catch (e) {
      return BigInt(0);
    }
  };

  const hasRequisiteData = poolInfo.data;
  const amountGreaterThanZero = fromParse(migrationAmount) > BigInt(0);
  const sufficientFromTokens =
    fromWalletBalance &&
    migrationAmount &&
    fromParse(migrationAmount) <= fromParse(fromWalletBalance);
  const sufficientPoolBalance =
    poolInfo.data?.toPoolBalance &&
    migrationAmount &&
    parseFloat(migrationAmount) <= parseFloat(poolInfo.data.toPoolBalance);

  const isReadyToTransfer =
    isReady &&
    amountGreaterThanZero &&
    sufficientFromTokens &&
    sufficientPoolBalance &&
    hasRequisiteData;

  const getNotReadyCause = () => {
    if (!isReady) {
      return "Connect your wallet to proceed.";
    } else if (poolInfo.error) {
      return "Unable to retrieve necessary information. This asset may not be supported.";
    } else if (!migrationAmount) {
      return "Enter an amount to transfer.";
    } else if (!amountGreaterThanZero) {
      return "The transfer amount must be greater than zero.";
    } else if (!sufficientFromTokens) {
      return "There are not sufficient funds in your wallet for this transfer.";
    } else if (!sufficientPoolBalance) {
      return "There are not sufficient funds in the pool for this transfer.";
    } else {
      return "";
    }
  };

  const handleAmountChange = useCallback(
    (event) => setMigrationAmount(event.target.value),
    [setMigrationAmount]
  );
  const handleMaxClick = useCallback(() => {
    if (fromWalletBalance) {
      setMigrationAmount(fromWalletBalance);
    }
  }, [fromWalletBalance]);

  const migrateTokens = useCallback(async () => {
    if (!poolInfo.data) {
      enqueueSnackbar(null, {
        content:
        <div style={{ border: '1px solid #6DA8FF', padding: '15px', margin: '15px' }}>
          <Text fontSize={15} fontWeight={200} lineHeight="20px" color="primaryText1">Could not migrate the tokens.</Text>
        </div>,
        // content: <Alert severity="error">Could not migrate the tokens.</Alert>,
      }); //Should never be hit
      return;
    }
    try {
      setMigrationIsProcessing(true);
      setError("");
      await poolInfo.data.fromToken.approve(
        poolInfo.data.migrator.address,
        parseUnits(migrationAmount, poolInfo.data.fromDecimals)
      );
      const transaction = await poolInfo.data.migrator.migrate(
        parseUnits(migrationAmount, poolInfo.data.fromDecimals)
      );
      await transaction.wait();
      setTransaction(transaction.hash);
      forceRefresh();
      enqueueSnackbar(null, {
        content: (
          // <Alert severity="success">Successfully migrated the tokens.</Alert>
          <div style={{ border: '1px solid #6DA8FF', padding: '15px', margin: '15px' }}>
            <Text fontSize={15} fontWeight={200} lineHeight="20px" color="primaryText1">Successfully migrated the tokens.</Text>
          </div>
        ),
      });
      setMigrationIsProcessing(false);
    } catch (e) {
      console.error(e);
      enqueueSnackbar(null, {
        // content: <Alert severity="error">Could not migrate the tokens.</Alert>,
        content: 
          <div style={{ border: '1px solid #6DA8FF', padding: '15px', margin: '15px' }}>
            <Text fontSize={15} fontWeight={200} lineHeight="20px" color="primaryText1">Could not migrate the tokens.</Text>
          </div>,
      });
      setMigrationIsProcessing(false);
      setError("Failed to send the transaction.");
    }
  }, [poolInfo.data, migrationAmount, enqueueSnackbar, forceRefresh]);

  //TODO tokenName
  const toTokenPretty = (
    <SmartAddress
      chainId={chainId}
      address={poolInfo.data?.toAddress}
      symbol={poolInfo.data?.toSymbol}
    />
  );
  const fromTokenPretty = (
    <SmartAddress
      chainId={chainId}
      address={poolInfo.data?.fromAddress}
      symbol={poolInfo.data?.fromSymbol}
    />
  );
  const poolPretty = (
    <SmartAddress chainId={chainId} address={poolInfo.data?.poolAddress} />
  );

  const fatalError = poolInfo.error
    ? "Unable to retrieve necessary information. This asset may not be supported."
    : null;

  const explainerContent = (
    <div>
      <Text fontSize={15} fontWeight={500} lineHeight="20px" color="white">This action will convert</Text>
      <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">
        {fromTokenPretty} {`(Balance: ${fromWalletBalance || ""})`}
      </Text>
      <div style={{height: "2rem"}} />
      <Text fontSize={15} fontWeight={500} lineHeight="20px" color="white">to</Text>
      <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">
        {toTokenPretty} {`(Balance: ${poolInfo.data?.toWalletBalance || ""})`}
      </Text>
      <div style={{height: "2rem"}} />
      <Text fontSize={15} fontWeight={500} lineHeight="20px" color="white">Utilizing this pool</Text>
      <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">
        {poolPretty} {`(Balance: ${poolInfo.data?.toPoolBalance || ""})`}
      </Text>
    </div>
  );

  const mainWorkflow = (
    <>
      {explainerContent}
      <div style={{height: "2rem"}} />
      <NumberTextField
        variant="outlined"
        value={migrationAmount}
        onChange={handleAmountChange}
        label={"Amount"}
        disabled={!!migrationIsProcessing || !!transaction}
        onMaxClick={fromWalletBalance ? handleMaxClick : undefined}
      />

      {!transaction && (
        <ButtonWithLoader
          disabled={!isReadyToTransfer || migrationIsProcessing}
          showLoader={migrationIsProcessing}
          onClick={migrateTokens}
        >
          {migrationAmount && isReadyToTransfer
            ? "Migrate " + migrationAmount + " Tokens"
            : "Migrate"}
        </ButtonWithLoader>
      )}

      {(error || !isReadyToTransfer) && (
        <div >
          <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">{error || getNotReadyCause()}</Text>
        </div>
      )}
      {transaction ? (
        <>
          <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">
            Successfully migrated your tokens! They will be available once this
            transaction confirms.
          </Text>
          <ShowTx tx={{ id: transaction, block: 1 }} chainId={chainId} />
        </>
      ) : null}
    </>
  );

  return (
    <div style={{ textAlign: "center", padding: '15px' }}>
      <EthereumSignerKey />
      {!isReady ? (
        <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">Please connect your wallet.</Text>
      ) : poolInfo.isLoading ? (
        // <CircularProgress />
        <></>
      ) : fatalError ? (
        <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white">{fatalError}</Text>
      ) : (
        mainWorkflow
      )}
    </div>
  );
}

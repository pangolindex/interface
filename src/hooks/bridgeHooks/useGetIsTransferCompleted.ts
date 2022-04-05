import {
  CHAIN_ID_TERRA,
  getIsTransferCompletedEth,
  getIsTransferCompletedTerra,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import {
  selectTransferIsRecovery,
  selectTransferTargetAddressHex,
  selectTransferTargetChain,
} from "src/store/selectors";
import {
  getEvmChainId,
  getTokenBridgeAddressForChain,
  TERRA_GAS_PRICES_URL,
  TERRA_HOST,
} from "src/utils/bridgeUtils/consts";
import useTransferSignedVAA from "./useTransferSignedVAA";
import { LCDClient } from "@terra-money/terra.js";
import useIsWalletReady from "./useIsWalletReady";

/**
 * @param recoveryOnly Only fire when in recovery mode
 */
export default function useGetIsTransferCompleted(recoveryOnly: boolean): {
  isTransferCompletedLoading: boolean;
  isTransferCompleted: boolean;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferCompleted, setIsTransferCompleted] = useState(false);

  const isRecovery = useSelector(selectTransferIsRecovery);
  const targetAddress = useSelector(selectTransferTargetAddressHex);
  const targetChain = useSelector(selectTransferTargetChain);

  const { isReady } = useIsWalletReady(targetChain, false);
  const { provider, chainId: evmChainId } = useEthereumProvider();
  const signedVAA = useTransferSignedVAA();

  const hasCorrectEvmNetwork = evmChainId === getEvmChainId(targetChain);
  const shouldFire = !recoveryOnly || isRecovery;

  useEffect(() => {
    if (!shouldFire) {
      return;
    }

    let cancelled = false;
    let transferCompleted = false;
    if (targetChain && targetAddress && signedVAA && isReady) {
      if (isEVMChain(targetChain) && hasCorrectEvmNetwork && provider) {
        setIsLoading(true);
        (async () => {
          try {
            transferCompleted = await getIsTransferCompletedEth(
              getTokenBridgeAddressForChain(targetChain),
              provider,
              signedVAA
            );
          } catch (error) {
            console.error(error);
          }
          if (!cancelled) {
            setIsTransferCompleted(transferCompleted);
            setIsLoading(false);
          }
        })();
      } else if (targetChain === CHAIN_ID_TERRA) {
        setIsLoading(true);
        (async () => {
          try {
            const lcdClient = new LCDClient(TERRA_HOST);
            transferCompleted = await getIsTransferCompletedTerra(
              getTokenBridgeAddressForChain(targetChain),
              signedVAA,
              lcdClient,
              TERRA_GAS_PRICES_URL
            );
          } catch (error) {
            console.error(error);
          }
          if (!cancelled) {
            setIsTransferCompleted(transferCompleted);
            setIsLoading(false);
          }
        })();
      }
    }
    return () => {
      cancelled = true;
    };
  }, [
    shouldFire,
    hasCorrectEvmNetwork,
    targetChain,
    targetAddress,
    signedVAA,
    isReady,
    provider,
  ]);

  return { isTransferCompletedLoading: isLoading, isTransferCompleted };
}

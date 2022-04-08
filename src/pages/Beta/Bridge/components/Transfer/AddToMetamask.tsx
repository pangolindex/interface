import { isEVMChain } from "@certusone/wormhole-sdk";
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import {
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetAsset,
  selectTransferTargetChain,
} from "src/store/selectors";
import { getEvmChainId } from "src/utils/bridgeUtils/consts";
import {
  ethTokenToParsedTokenAccount,
  getEthereumToken,
} from "src/utils/bridgeUtils/ethereum";
import { Button, Text } from "@pangolindex/components"

export default function AddToMetamask() {
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAsset = useSelector(selectTransferTargetAsset);
  const {
    provider,
    signerAddress,
    chainId: evmChainId,
  } = useEthereumProvider();
  const hasCorrectEvmNetwork = evmChainId === getEvmChainId(targetChain);
  const handleClick = useCallback(() => {
    if (provider && targetAsset && signerAddress && hasCorrectEvmNetwork) {
      (async () => {
        try {
          const token = await getEthereumToken(targetAsset, provider);
          const { symbol, decimals } = await ethTokenToParsedTokenAccount(
            token,
            signerAddress
          );
          const ethereum = (await detectEthereumProvider()) as any;
          ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // In the future, other standards will be supported
              options: {
                address: targetAsset, // The address of the token contract
                symbol: (
                  symbol ||
                  sourceParsedTokenAccount?.symbol ||
                  "wh"
                ).substr(0, 5), // A ticker symbol or shorthand, up to 5 characters
                decimals, // The number of token decimals
                // image: string; // A string url of the token logo
              },
            },
          });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [
    provider,
    targetAsset,
    signerAddress,
    hasCorrectEvmNetwork,
    sourceParsedTokenAccount,
  ]);
  return provider &&
    signerAddress &&
    targetAsset &&
    isEVMChain(targetChain) &&
    hasCorrectEvmNetwork ? (
    <Button
      onClick={handleClick}
      variant="outline"
    >
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
        Add to Metamask
      </Text>
    </Button>
  ) : null;
}

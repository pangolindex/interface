import {
  CHAIN_ID_TERRA,
  isEVMChain,
  isNativeDenom,
  TokenImplementation__factory,
} from "@certusone/wormhole-sdk";
import { LCDClient } from "@terra-money/terra.js";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { formatUnits } from "ethers/lib/utils";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "src/contexts/EthereumProviderContext";
import {
  selectTransferTargetAsset,
  selectTransferTargetChain,
} from "src/store/selectors";
import { setTargetParsedTokenAccount } from "src/store/transferSlice";
import { getEvmChainId, TERRA_HOST } from "src/utils/bridgeUtils/consts";
import { NATIVE_TERRA_DECIMALS } from "src/utils/bridgeUtils/terra";
import { createParsedTokenAccount } from "./useGetSourceParsedTokenAccounts";
import useMetadata from "./useMetadata";

function useGetTargetParsedTokenAccounts() {
  const dispatch = useDispatch();
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAsset = useSelector(selectTransferTargetAsset);
  const targetAssetArrayed = useMemo(
    () => (targetAsset ? [targetAsset] : []),
    [targetAsset]
  );
  const metadata = useMetadata(targetChain, targetAssetArrayed);
  const tokenName =
    (targetAsset && metadata.data?.get(targetAsset)?.tokenName) || undefined;
  const symbol =
    (targetAsset && metadata.data?.get(targetAsset)?.symbol) || undefined;
  const logo =
    (targetAsset && metadata.data?.get(targetAsset)?.logo) || undefined;
  const terraWallet = useConnectedWallet();
  const {
    provider,
    signerAddress,
    chainId: evmChainId,
  } = useEthereumProvider();
  const hasCorrectEvmNetwork = evmChainId === getEvmChainId(targetChain);
  const hasResolvedMetadata = metadata.data || metadata.error;
  useEffect(() => {
    // targetParsedTokenAccount is cleared on setTargetAsset, but we need to clear it on wallet changes too
    dispatch(setTargetParsedTokenAccount(undefined));
    if (!targetAsset || !hasResolvedMetadata) {
      return;
    }
    let cancelled = false;

    if (targetChain === CHAIN_ID_TERRA && terraWallet) {
      const lcd = new LCDClient(TERRA_HOST);
      if (isNativeDenom(targetAsset)) {
        lcd.bank
          .balance(terraWallet.walletAddress)
          .then(([coins]) => {
            const balance = coins.get(targetAsset)?.amount?.toString();
            if (balance && !cancelled) {
              dispatch(
                setTargetParsedTokenAccount(
                  createParsedTokenAccount(
                    "",
                    "",
                    balance,
                    NATIVE_TERRA_DECIMALS,
                    Number(formatUnits(balance, NATIVE_TERRA_DECIMALS)),
                    formatUnits(balance, NATIVE_TERRA_DECIMALS),
                    symbol,
                    tokenName,
                    logo
                  )
                )
              );
            }
          })
          .catch(() => {
            if (!cancelled) {
              // TODO: error state
            }
          });
      } else {
        lcd.wasm
          .contractQuery(targetAsset, {
            token_info: {},
          })
          .then((info: any) =>
            lcd.wasm
              .contractQuery(targetAsset, {
                balance: {
                  address: terraWallet.walletAddress,
                },
              })
              .then((balance: any) => {
                if (balance && info && !cancelled) {
                  dispatch(
                    setTargetParsedTokenAccount(
                      createParsedTokenAccount(
                        "",
                        "",
                        balance.balance.toString(),
                        info.decimals,
                        Number(formatUnits(balance.balance, info.decimals)),
                        formatUnits(balance.balance, info.decimals),
                        symbol,
                        tokenName,
                        logo
                      )
                    )
                  );
                }
              })
          )
          .catch(() => {
            if (!cancelled) {
              // TODO: error state
            }
          });
      }
    }
    if (
      isEVMChain(targetChain) &&
      provider &&
      signerAddress &&
      hasCorrectEvmNetwork
    ) {
      const token = TokenImplementation__factory.connect(targetAsset, provider);
      token
        .decimals()
        .then((decimals) => {
          token.balanceOf(signerAddress).then((n) => {
            if (!cancelled) {
              dispatch(
                setTargetParsedTokenAccount(
                  // TODO: verify accuracy
                  createParsedTokenAccount(
                    signerAddress,
                    token.address,
                    n.toString(),
                    decimals,
                    Number(formatUnits(n, decimals)),
                    formatUnits(n, decimals),
                    symbol,
                    tokenName,
                    logo
                  )
                )
              );
            }
          });
        })
        .catch(() => {
          if (!cancelled) {
            // TODO: error state
          }
        });
    }
    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    targetAsset,
    targetChain,
    provider,
    signerAddress,
    terraWallet,
    hasCorrectEvmNetwork,
    hasResolvedMetadata,
    symbol,
    tokenName,
    logo,
  ]);
}

export default useGetTargetParsedTokenAccounts;

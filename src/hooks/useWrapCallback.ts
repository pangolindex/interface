import { Currency, currencyEquals, CAVAX, WAVAX, ChainId } from '@pangolindex/sdk'
import { useMemo } from 'react'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useWETHContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(chainId || ChainId.AVALANCHE, account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(chainId ? chainId : ChainId.AVALANCHE, typedValue, inputCurrency), [chainId, inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
    [ChainId.FUJI]: 'AVAX',
    [ChainId.AVALANCHE]: 'AVAX',
    [ChainId.WAGMI]: 'WGM'
  }

  const NETWORK_WRAPPED_CURRENCY: { [chainId in ChainId]?: string } = {
    [ChainId.FUJI]: 'WAVAX',
    [ChainId.AVALANCHE]: 'WAVAX',
    [ChainId.WAGMI]: 'wWAGMI'
  }

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency === CAVAX[chainId || ChainId.AVALANCHE] && currencyEquals(WAVAX[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` })
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ${NETWORK_CURRENCY[chainId]} to ${NETWORK_WRAPPED_CURRENCY[chainId]}` })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : `Insufficient ${NETWORK_CURRENCY[chainId]} balance`
      }
    } else if (currencyEquals(WAVAX[chainId], inputCurrency) && outputCurrency === CAVAX[chainId || ChainId.AVALANCHE]) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} ${NETWORK_WRAPPED_CURRENCY[chainId]} to ${NETWORK_CURRENCY[chainId]}` })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : `Insufficient ${NETWORK_WRAPPED_CURRENCY[chainId]} balance`
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction, NETWORK_WRAPPED_CURRENCY, NETWORK_CURRENCY])
}

import { CurrencyAmount, CAVAX, JSBI } from '@pangolindex/sdk'
import { MIN_ETH } from '../constants'
import { CurrencyAmount as UniCurrencyAmount, Currency } from '@uniswap/sdk-core'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === CAVAX) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }
  return currencyAmount
}

export function galetoMaxAmountSpend(currencyAmount?: UniCurrencyAmount<Currency>): any | undefined {
  if (!currencyAmount) return undefined
  if (!currencyAmount.currency.isToken) {
    if (JSBI.greaterThan(currencyAmount.numerator, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.numerator, MIN_ETH))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }
  return currencyAmount
}

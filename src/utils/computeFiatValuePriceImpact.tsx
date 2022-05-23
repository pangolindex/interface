import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

export function computeFiatValuePriceImpact(
  fiatValueInput: CurrencyAmount<Token> | undefined | null,
  fiatValueOutput: CurrencyAmount<Token> | undefined | null
): Percent | undefined {
  if (!fiatValueOutput || !fiatValueInput) return undefined
  if (JSBI.equal(fiatValueInput.quotient, JSBI.BigInt(0))) return undefined
  const pct = new Percent('1').subtract(fiatValueOutput.divide(fiatValueInput))
  return new Percent(pct.numerator, pct.denominator)
}

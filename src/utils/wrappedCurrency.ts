import { ChainId, Currency, CurrencyAmount, CAVAX, Token, TokenAmount, WAVAX } from '@pangolindex/sdk'
import { NativeCurrency as UniCurrency, Token as UniToken } from '@uniswap/sdk-core'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === CAVAX ? WAVAX[chainId] : currency instanceof Token ? currency : undefined
}

function convertToPangolinToken(token: UniToken): Token {
  return new Token(token.chainId, token.address, token.decimals, token?.symbol, token?.name)
}

export function wrappedGelatoCurrency(
  currency: UniCurrency | UniToken,
  chainId: ChainId | undefined
): Token | undefined {
  return chainId && !currency?.isToken
    ? WAVAX[chainId]
    : currency.isToken
    ? convertToPangolinToken(currency)
    : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency | Token {
  if (token?.equals(WAVAX[token.chainId])) return CAVAX
  return token
}

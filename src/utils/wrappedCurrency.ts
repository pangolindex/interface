import { ChainId, Currency, CurrencyAmount, CAVAX, Token, TokenAmount, WAVAX } from '@pangolindex/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === CAVAX[chainId] ? WAVAX[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token, chainId: ChainId): Currency | Token {
  if (token?.equals?.(WAVAX[token.chainId])) return CAVAX[chainId]
  return token
}

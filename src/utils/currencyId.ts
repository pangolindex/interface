import { Currency, CAVAX, Token, ChainId } from '@pangolindex/sdk'

export function currencyId(currency: Currency, chainId: ChainId): string {
  if (chainId && currency === CAVAX[chainId]) return 'AVAX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

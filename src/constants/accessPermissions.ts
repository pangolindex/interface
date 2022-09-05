import { ChainId } from '@pangolindex/sdk'

export const VOTE_PAGE_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false
}

export const LIMITORDERLIST_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false
}

export const MYPORTFOLIO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false
}

export const WATCHLIST_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false
}

export const PAIRINFO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false
}

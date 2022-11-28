import { ChainId } from '@pangolindex/sdk'

export const VOTE_PAGE_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: false,
  [ChainId.POLYGON]: false,
  [ChainId.FANTOM]: false,
  [ChainId.XDAI]: false,
  [ChainId.BSC]: false,
  [ChainId.ARBITRUM]: false,
  [ChainId.CELO]: false,
  [ChainId.OKXCHAIN]: false,
  [ChainId.VELAS]: false,
  [ChainId.AURORA]: false,
  [ChainId.CRONOS]: false,
  [ChainId.FUSE]: false,
  [ChainId.MOONRIVER]: false,
  [ChainId.MOONBEAM]: false,
  [ChainId.OP]: false
}

export const LIMITORDERLIST_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: false,
  [ChainId.POLYGON]: false,
  [ChainId.FANTOM]: false,
  [ChainId.XDAI]: false,
  [ChainId.BSC]: false,
  [ChainId.ARBITRUM]: false,
  [ChainId.CELO]: false,
  [ChainId.OKXCHAIN]: false,
  [ChainId.VELAS]: false,
  [ChainId.AURORA]: false,
  [ChainId.CRONOS]: false,
  [ChainId.FUSE]: false,
  [ChainId.MOONRIVER]: false,
  [ChainId.MOONBEAM]: false,
  [ChainId.OP]: false
}

export const MYPORTFOLIO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: false,
  [ChainId.POLYGON]: false,
  [ChainId.FANTOM]: false,
  [ChainId.XDAI]: false,
  [ChainId.BSC]: false,
  [ChainId.ARBITRUM]: false,
  [ChainId.CELO]: false,
  [ChainId.OKXCHAIN]: false,
  [ChainId.VELAS]: false,
  [ChainId.AURORA]: false,
  [ChainId.CRONOS]: false,
  [ChainId.FUSE]: false,
  [ChainId.MOONRIVER]: false,
  [ChainId.MOONBEAM]: false,
  [ChainId.OP]: false
}

export const WATCHLIST_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: false,
  [ChainId.POLYGON]: false,
  [ChainId.FANTOM]: false,
  [ChainId.XDAI]: false,
  [ChainId.BSC]: false,
  [ChainId.ARBITRUM]: false,
  [ChainId.CELO]: false,
  [ChainId.OKXCHAIN]: false,
  [ChainId.VELAS]: false,
  [ChainId.AURORA]: false,
  [ChainId.CRONOS]: false,
  [ChainId.FUSE]: false,
  [ChainId.MOONRIVER]: false,
  [ChainId.MOONBEAM]: false,
  [ChainId.OP]: false
}

export const PAIRINFO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: false,
  [ChainId.POLYGON]: false,
  [ChainId.FANTOM]: false,
  [ChainId.XDAI]: false,
  [ChainId.BSC]: false,
  [ChainId.ARBITRUM]: false,
  [ChainId.CELO]: false,
  [ChainId.OKXCHAIN]: false,
  [ChainId.VELAS]: false,
  [ChainId.AURORA]: false,
  [ChainId.CRONOS]: false,
  [ChainId.FUSE]: false,
  [ChainId.MOONRIVER]: false,
  [ChainId.MOONBEAM]: false,
  [ChainId.OP]: false
}

export const ONLY_BRIDGE_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: false,
  [ChainId.AVALANCHE]: false,
  [ChainId.WAGMI]: false,
  [ChainId.COSTON]: false,
  [ChainId.SONGBIRD]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.ETHEREUM]: true,
  [ChainId.POLYGON]: true,
  [ChainId.FANTOM]: true,
  [ChainId.XDAI]: true,
  [ChainId.BSC]: true,
  [ChainId.ARBITRUM]: true,
  [ChainId.CELO]: true,
  [ChainId.OKXCHAIN]: true,
  [ChainId.VELAS]: true,
  [ChainId.AURORA]: true,
  [ChainId.CRONOS]: true,
  [ChainId.FUSE]: true,
  [ChainId.MOONRIVER]: true,
  [ChainId.MOONBEAM]: true,
  [ChainId.OP]: true
}

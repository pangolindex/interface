import { ChainId } from '@pangolindex/sdk'
import { MENU_LINK } from '.'

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

const onlyBridgeHideOtherMenus: MENU_LINK[] = [
  MENU_LINK.swap,
  MENU_LINK.buy,
  MENU_LINK.pool,
  MENU_LINK.stake,
  MENU_LINK.vote,
  MENU_LINK.migrate,
  MENU_LINK.airdrop,
  MENU_LINK.stakev2
]

const nonEvmHideList: MENU_LINK[] = [
  MENU_LINK.buy,
  MENU_LINK.pool,
  MENU_LINK.stake,
  MENU_LINK.vote,
  MENU_LINK.migrate,
  MENU_LINK.airdrop,
  MENU_LINK.stakev2
]

export const HIDE_MENU_ACCESS_MANAGEMENT: { [chainId in ChainId]?: MENU_LINK[] } = {
  [ChainId.FUJI]: [],
  [ChainId.AVALANCHE]: [],
  [ChainId.WAGMI]: [],
  [ChainId.COSTON]: [],
  [ChainId.SONGBIRD]: [MENU_LINK.vote],
  [ChainId.HEDERA_TESTNET]: [MENU_LINK.vote, MENU_LINK.migrate, MENU_LINK.airdrop],
  [ChainId.NEAR_MAINNET]: nonEvmHideList,
  [ChainId.NEAR_TESTNET]: nonEvmHideList,
  [ChainId.ETHEREUM]: onlyBridgeHideOtherMenus,
  [ChainId.POLYGON]: onlyBridgeHideOtherMenus,
  [ChainId.FANTOM]: onlyBridgeHideOtherMenus,
  [ChainId.XDAI]: onlyBridgeHideOtherMenus,
  [ChainId.BSC]: onlyBridgeHideOtherMenus,
  [ChainId.ARBITRUM]: onlyBridgeHideOtherMenus,
  [ChainId.CELO]: onlyBridgeHideOtherMenus,
  [ChainId.OKXCHAIN]: onlyBridgeHideOtherMenus,
  [ChainId.VELAS]: onlyBridgeHideOtherMenus,
  [ChainId.AURORA]: onlyBridgeHideOtherMenus,
  [ChainId.CRONOS]: onlyBridgeHideOtherMenus,
  [ChainId.FUSE]: onlyBridgeHideOtherMenus,
  [ChainId.MOONRIVER]: onlyBridgeHideOtherMenus,
  [ChainId.MOONBEAM]: onlyBridgeHideOtherMenus,
  [ChainId.OP]: onlyBridgeHideOtherMenus
}

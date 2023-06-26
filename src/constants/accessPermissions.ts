import { ChainId } from '@pangolindex/sdk'
import { AIRDROP_MENU_LINK, BUY_MENU_LINK, CHILD_MENU_TYPES, MENU_LINK, POOL_MENU_LINK } from '.'

export const LIMITORDERLIST_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.FLARE_MAINNET]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.HEDERA_MAINNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.COSTON2]: false,
  [ChainId.EVMOS_TESTNET]: false,
  [ChainId.EVMOS_MAINNET]: false,
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
  [ChainId.OP]: false,
  [ChainId.SKALE_BELLATRIX_TESTNET]: false
}

export const MYPORTFOLIO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.FLARE_MAINNET]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.HEDERA_MAINNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.COSTON2]: false,
  [ChainId.EVMOS_TESTNET]: false,
  [ChainId.EVMOS_MAINNET]: false,
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
  [ChainId.OP]: false,
  [ChainId.SKALE_BELLATRIX_TESTNET]: false
}

export const PAIRINFO_ACCESS: { [chainId in ChainId]: boolean } = {
  [ChainId.FUJI]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.WAGMI]: true,
  [ChainId.COSTON]: true,
  [ChainId.SONGBIRD]: false,
  [ChainId.FLARE_MAINNET]: false,
  [ChainId.HEDERA_TESTNET]: false,
  [ChainId.HEDERA_MAINNET]: false,
  [ChainId.NEAR_MAINNET]: false,
  [ChainId.NEAR_TESTNET]: false,
  [ChainId.COSTON2]: false,
  [ChainId.EVMOS_TESTNET]: false,
  [ChainId.EVMOS_MAINNET]: false,
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
  [ChainId.OP]: false,
  [ChainId.SKALE_BELLATRIX_TESTNET]: false
}

const onlyBridgeHideOtherMenus: MENU_LINK[] = [
  MENU_LINK.swap,
  MENU_LINK.pool,
  MENU_LINK.stake,
  MENU_LINK.vote,
  MENU_LINK.migrate,
  MENU_LINK.airdrop,
  MENU_LINK.stakev2
]

const nonEvmHideList: MENU_LINK[] = [
  MENU_LINK.pool,
  MENU_LINK.stake,
  MENU_LINK.vote,
  MENU_LINK.migrate,
  MENU_LINK.airdrop,
  MENU_LINK.stakev2
]

/**
 * An object that holds access management rules for base menu items in a navigation structure.
 * It is typically used to conditionally hide or display certain child menu items based on specific criteria,
 * such as the current active chain, or other application-specific conditions.
 */
export const HIDE_MENU_ACCESS_MANAGEMENT: { [chainId in ChainId]?: MENU_LINK[] } = {
  [ChainId.FUJI]: [MENU_LINK.stakev2],
  [ChainId.AVALANCHE]: [MENU_LINK.stakev2],
  [ChainId.WAGMI]: [],
  [ChainId.COSTON]: [MENU_LINK.stake],
  [ChainId.SONGBIRD]: [MENU_LINK.vote, MENU_LINK.stake],
  [ChainId.FLARE_MAINNET]: [MENU_LINK.vote, MENU_LINK.stake],
  [ChainId.HEDERA_TESTNET]: [MENU_LINK.migrate, MENU_LINK.airdrop, MENU_LINK.stake],
  [ChainId.HEDERA_MAINNET]: [MENU_LINK.vote, MENU_LINK.migrate, MENU_LINK.airdrop, MENU_LINK.stake],
  [ChainId.NEAR_MAINNET]: nonEvmHideList,
  [ChainId.NEAR_TESTNET]: nonEvmHideList,
  [ChainId.COSTON2]: [MENU_LINK.stake],
  [ChainId.EVMOS_TESTNET]: [MENU_LINK.vote, MENU_LINK.stake],
  [ChainId.EVMOS_MAINNET]: [MENU_LINK.vote, MENU_LINK.stake, MENU_LINK.stakev2],
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
  [ChainId.OP]: onlyBridgeHideOtherMenus,
  [ChainId.SKALE_BELLATRIX_TESTNET]: [MENU_LINK.vote, MENU_LINK.stake]
}

/**
 * An object that holds access management rules for child menu items in a navigation structure.
 * It is typically used to conditionally hide or display certain child menu items based on specific criteria,
 * such as the current active chain, or other application-specific conditions.
 */
export const HIDE_CHILD_MENU_ACCESS_MANAGEMENT: { [chainId in ChainId]?: CHILD_MENU_TYPES[] } = {
  [ChainId.FUJI]: [BUY_MENU_LINK.c14],
  [ChainId.AVALANCHE]: [BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.WAGMI]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.COSTON]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.SONGBIRD]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.FLARE_MAINNET]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.HEDERA_TESTNET]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.HEDERA_MAINNET]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.NEAR_MAINNET]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.NEAR_TESTNET]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.COSTON2]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.EVMOS_TESTNET]: [BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.EVMOS_MAINNET]: [AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.ETHEREUM]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.POLYGON]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.FANTOM]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.XDAI]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.BSC]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.ARBITRUM]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.CELO]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.OKXCHAIN]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.VELAS]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.AURORA]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.CRONOS]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.FUSE]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.MOONRIVER]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.MOONBEAM]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.OP]: [POOL_MENU_LINK.elixir, BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops],
  [ChainId.SKALE_BELLATRIX_TESTNET]: [BUY_MENU_LINK.c14, AIRDROP_MENU_LINK.hederaAirdrops]
}

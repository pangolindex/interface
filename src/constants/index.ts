import { ChainId, JSBI, CHAINS } from '@pangolindex/sdk'
import { ZERO_ADDRESS } from '@pangolindex/components'

export const LEGACY_PAGE = 'https://legacy.pangolin.exchange'
export const PANGOLIN_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/pangolindex/tokens`

export const DIRECTUS_GRAPHQL_URL = `https://pangolin.directus.app/graphql`
export const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export const DISCORD_SUPPORT = 'https://discord.com/channels/786999832027463710/1034725721660211210'

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string, chainId: number, size: LogoSize = 24) =>
  `${PANGOLIN_TOKENS_REPO_RAW_BASE_URL}/main/assets/${chainId}/${address}/logo_${size}.png`

// LEGACY AIRDROPS ADDRESSES
export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.airdrop!.address,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.airdrop!.address,
  [ChainId.COSTON]: ZERO_ADDRESS,
  [ChainId.SONGBIRD]: ZERO_ADDRESS,
  [ChainId.FLARE_MAINNET]: ZERO_ADDRESS,
  [ChainId.HEDERA_TESTNET]: ZERO_ADDRESS,
  [ChainId.HEDERA_MAINNET]: ZERO_ADDRESS,
  [ChainId.COSTON2]: ZERO_ADDRESS,
  [ChainId.EVMOS_TESTNET]: ZERO_ADDRESS,
  [ChainId.EVMOS_MAINNET]: ZERO_ADDRESS
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].name,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].name,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].name,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].name,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].name,
  [ChainId.FLARE_MAINNET]: CHAINS[ChainId.FLARE_MAINNET].name,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].name,
  [ChainId.HEDERA_MAINNET]: CHAINS[ChainId.HEDERA_MAINNET].name,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].name,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].name,
  [ChainId.COSTON2]: CHAINS[ChainId.COSTON2].name,
  [ChainId.EVMOS_TESTNET]: CHAINS[ChainId.EVMOS_TESTNET].name,
  [ChainId.EVMOS_MAINNET]: CHAINS[ChainId.EVMOS_MAINNET].name,
  [ChainId.ETHEREUM]: CHAINS[ChainId.ETHEREUM].name,
  [ChainId.POLYGON]: CHAINS[ChainId.POLYGON].name,
  [ChainId.FANTOM]: CHAINS[ChainId.FANTOM].name,
  [ChainId.XDAI]: CHAINS[ChainId.XDAI].name,
  [ChainId.BSC]: CHAINS[ChainId.BSC].name,
  [ChainId.ARBITRUM]: CHAINS[ChainId.ARBITRUM].name,
  [ChainId.CELO]: CHAINS[ChainId.CELO].name,
  [ChainId.OKXCHAIN]: CHAINS[ChainId.OKXCHAIN].name,
  [ChainId.VELAS]: CHAINS[ChainId.VELAS].name,
  [ChainId.AURORA]: CHAINS[ChainId.AURORA].name,
  [ChainId.CRONOS]: CHAINS[ChainId.CRONOS].name,
  [ChainId.FUSE]: CHAINS[ChainId.FUSE].name,
  [ChainId.MOONRIVER]: CHAINS[ChainId.MOONRIVER].name,
  [ChainId.MOONBEAM]: CHAINS[ChainId.MOONBEAM].name,
  [ChainId.OP]: CHAINS[ChainId.OP].name
}

export const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].symbol,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].symbol,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].symbol,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].symbol,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].symbol,
  [ChainId.FLARE_MAINNET]: CHAINS[ChainId.FLARE_MAINNET].symbol,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].symbol,
  [ChainId.HEDERA_MAINNET]: CHAINS[ChainId.HEDERA_MAINNET].symbol,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].symbol,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].symbol,
  [ChainId.COSTON2]: CHAINS[ChainId.COSTON2].symbol,
  [ChainId.EVMOS_TESTNET]: CHAINS[ChainId.EVMOS_TESTNET].symbol,
  [ChainId.EVMOS_MAINNET]: CHAINS[ChainId.EVMOS_MAINNET].symbol,
  [ChainId.ETHEREUM]: CHAINS[ChainId.ETHEREUM].symbol,
  [ChainId.POLYGON]: CHAINS[ChainId.POLYGON].symbol,
  [ChainId.FANTOM]: CHAINS[ChainId.FANTOM].symbol,
  [ChainId.XDAI]: CHAINS[ChainId.XDAI].symbol,
  [ChainId.BSC]: CHAINS[ChainId.BSC].symbol,
  [ChainId.ARBITRUM]: CHAINS[ChainId.ARBITRUM].symbol,
  [ChainId.CELO]: CHAINS[ChainId.CELO].symbol,
  [ChainId.OKXCHAIN]: CHAINS[ChainId.OKXCHAIN].symbol,
  [ChainId.VELAS]: CHAINS[ChainId.VELAS].symbol,
  [ChainId.AURORA]: CHAINS[ChainId.AURORA].symbol,
  [ChainId.CRONOS]: CHAINS[ChainId.CRONOS].symbol,
  [ChainId.FUSE]: CHAINS[ChainId.FUSE].symbol,
  [ChainId.MOONRIVER]: CHAINS[ChainId.MOONRIVER].symbol,
  [ChainId.MOONBEAM]: CHAINS[ChainId.MOONBEAM].symbol,
  [ChainId.OP]: CHAINS[ChainId.OP].symbol
}

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 10 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 10 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const MOONPAY_PK = import.meta.env.VITE_MOONPAY_PK || ''
export const COINBASE_PK = import.meta.env.VITE_COINBASE_PK || ''
export const C14_ASSET_ID = 'e2e0546e-b51b-4d56-9426-3aff3a2418ba'
export const SUBGRAPH_BASE_URL = import.meta.env.VITE_SUBGRAPH_BASE_URL

export enum MENU_LINK {
  dashboard = '/dashboard',
  swap = '/swap',
  buy = '/buy',
  pool = '/pool',
  stake = '/stake',
  vote = '/vote',
  migrate = '/migrate',
  bridge = '/bridge',
  airdrop = '/airdrop',
  stakev2 = '/stakev2'
}

export enum BUY_MENU_LINK {
  moonpay = 'moonpay',
  coinbasePay = 'coinbase-pay',
  c14 = 'c14'
}

export enum POOL_MENU_LINK {
  standard = 'standard',
  elixir = 'elixir'
}

export enum AIRDROP_MENU_LINK {
  evmAirdrops = 'evm-airdrops',
  hederaAirdrops = 'hedera-airdrops'
}

export type CHILD_MENU_TYPES = BUY_MENU_LINK | POOL_MENU_LINK | AIRDROP_MENU_LINK

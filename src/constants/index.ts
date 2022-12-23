import { ChainId, JSBI, CHAINS } from '@pangolindex/sdk'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.router,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.router,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.router,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.router,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].contracts!.router,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].contracts!.router,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET]?.contracts!.router,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET]?.contracts!.router,
  [ChainId.ETHEREUM]: '',
  [ChainId.POLYGON]: '',
  [ChainId.FANTOM]: '',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.CELO]: '',
  [ChainId.OKXCHAIN]: '',
  [ChainId.VELAS]: '',
  [ChainId.AURORA]: '',
  [ChainId.CRONOS]: '',
  [ChainId.FUSE]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.MOONBEAM]: '',
  [ChainId.OP]: ''
}

export const ANALYTICS_PAGE = 'https://info.pangolin.exchange'
export const LEGACY_PAGE = 'https://legacy.pangolin.exchange'

export const PANGOLIN_API_BASE_URL = `https://api.pangolin.exchange`

export const PANGOLIN_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/pangolindex/tokens`

export const DIRECTUS_GRAPHQL_URL = `https://pangolin.directus.app/graphql`
export const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export const DISCORD_SUPPORT = 'https://discord.com/channels/786999832027463710/1034725721660211210'

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string, chainId: number, size: LogoSize = 24) =>
  `${PANGOLIN_TOKENS_REPO_RAW_BASE_URL}/main/assets/${chainId}/${address}/logo_${size}.png`

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1'

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.mini_chef!.address,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.mini_chef!.address,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.mini_chef!.address,
  [ChainId.COSTON]: ZERO_ADDRESS,
  [ChainId.SONGBIRD]: ZERO_ADDRESS,
  [ChainId.HEDERA_TESTNET]: ZERO_ADDRESS,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].contracts!.mini_chef!.address,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].contracts!.mini_chef!.address,
  [ChainId.ETHEREUM]: ZERO_ADDRESS,
  [ChainId.POLYGON]: ZERO_ADDRESS,
  [ChainId.FANTOM]: ZERO_ADDRESS,
  [ChainId.XDAI]: ZERO_ADDRESS,
  [ChainId.BSC]: ZERO_ADDRESS,
  [ChainId.ARBITRUM]: ZERO_ADDRESS,
  [ChainId.CELO]: ZERO_ADDRESS,
  [ChainId.OKXCHAIN]: ZERO_ADDRESS,
  [ChainId.VELAS]: ZERO_ADDRESS,
  [ChainId.AURORA]: ZERO_ADDRESS,
  [ChainId.CRONOS]: ZERO_ADDRESS,
  [ChainId.FUSE]: ZERO_ADDRESS,
  [ChainId.MOONRIVER]: ZERO_ADDRESS,
  [ChainId.MOONBEAM]: ZERO_ADDRESS,
  [ChainId.OP]: ZERO_ADDRESS
}

// LEGACY AIRDROPS ADRESSES
export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.airdrop!.address,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.airdrop!.address,
  [ChainId.COSTON]: ZERO_ADDRESS,
  [ChainId.SONGBIRD]: ZERO_ADDRESS,
  [ChainId.HEDERA_TESTNET]: ZERO_ADDRESS
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].name,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].name,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].name,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].name,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].name,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].name,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].name,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].name,
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
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].symbol,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].symbol,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].symbol,
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

export const MOONPAY_PK = process.env.REACT_APP_MOONPAY_PK || ''
export const SUBGRAPH_BASE_URL = process.env.REACT_APP_SUBGRAPH_BASE_URL

export const TIMEFRAME = [
  {
    description: 'HOUR',
    label: '1H',
    interval: 60,
    momentIdentifier: 'hour'
  },
  {
    description: 'DAY',
    label: '1D',
    interval: 3600,
    momentIdentifier: 'day'
  },
  {
    description: 'WEEK',
    label: '1W',
    interval: 86400,
    momentIdentifier: 'week'
  },
  {
    description: 'MONTH',
    label: '1M',
    interval: 604800,
    momentIdentifier: 'month'
  },
  {
    description: 'YEAR',
    label: '1Y',
    interval: 2629746,
    momentIdentifier: 'year'
  },
  {
    description: 'ALL',
    label: 'ALL',
    interval: 2629746,
    momentIdentifier: ''
  }
]

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

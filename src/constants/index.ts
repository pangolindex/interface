import { ChainId, JSBI, CHAINS } from '@pangolindex/sdk'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.router,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.router,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.router,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.router,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET]?.contracts!.router,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET]?.contracts!.router
}

export const ANALYTICS_PAGE = 'https://info.pangolin.exchange'
export const LEGACY_PAGE = 'https://legacy.pangolin.exchange'

export const PANGOLIN_API_BASE_URL = `https://api.pangolin.exchange`

export const PANGOLIN_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/pangolindex/tokens`

export const DIRECTUS_GRAPHQL_URL = `https://pangolin.directus.app/graphql`
export const COINGECKO_API = 'https://api.coingecko.com/api/v3'

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
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].contracts!.mini_chef!.address,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].contracts!.mini_chef!.address
}

// LEGACY AIRDROPS ADRESSES
export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.airdrop!.address,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.airdrop!.address,
  [ChainId.COSTON]: ZERO_ADDRESS
}

export const MERKLEDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.airdrop!.address!
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].name,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].name,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].name,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].name,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].name,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].name
}

export const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].symbol,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].symbol,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].symbol,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].symbol,
  [ChainId.NEAR_MAINNET]: CHAINS[ChainId.NEAR_MAINNET].symbol,
  [ChainId.NEAR_TESTNET]: CHAINS[ChainId.NEAR_TESTNET].symbol
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

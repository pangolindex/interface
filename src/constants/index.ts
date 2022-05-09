import { ChainId, JSBI, Percent, Token, WAVAX, CHAINS } from '@pangolindex/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { gnosisSafe, injected, walletconnect, walletlink, xDefi } from '../connectors'
import { DAIe, PNG, USDC, USDCe, USDTe, UST, axlUST } from './tokens'

export const GAS_PRICE = 225

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.router,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.router,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.router,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.router
}

export const LANDING_PAGE = 'https://pangolin.exchange'
export const ANALYTICS_PAGE = 'https://info.pangolin.exchange'

export const PANGOLIN_API_BASE_URL = `https://api.pangolin.exchange`

export const PANGOLIN_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/pangolindex/tokens`

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string, size: LogoSize = 24) =>
  `${PANGOLIN_TOKENS_REPO_RAW_BASE_URL}/main/assets/${address}/logo_${size}.png`

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1'

export const BRIDGE_MIGRATOR_ADDRESS = '0x4b23Aa72A1214d0E4fd3f2c8Da7C6ba660F7483C'

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.mini_chef!,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.mini_chef!,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.mini_chef!
}

export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.airdrop!,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.airdrop!,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.airdrop!
}

const WAVAX_AND_PNG_ONLY: ChainTokenList = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI], PNG[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
  [ChainId.WAGMI]: [WAVAX[ChainId.WAGMI], PNG[ChainId.WAGMI]],
  [ChainId.COSTON]: [WAVAX[ChainId.COSTON], PNG[ChainId.COSTON]]
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].name,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].name,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].name,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].name
}

export const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].symbol,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].symbol,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].symbol,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].symbol
}

export const NETWORK_WRAPPED_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'WAVAX',
  [ChainId.AVALANCHE]: 'WAVAX',
  [ChainId.WAGMI]: 'wWAGMI',
  [ChainId.COSTON]: 'wCFLR'
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI], PNG[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [
    WAVAX[ChainId.AVALANCHE],
    PNG[ChainId.AVALANCHE],
    USDTe[ChainId.AVALANCHE],
    DAIe[ChainId.AVALANCHE],
    USDCe[ChainId.AVALANCHE],
    UST[ChainId.AVALANCHE],
    axlUST[ChainId.AVALANCHE],
    USDC[ChainId.AVALANCHE]
  ],
  [ChainId.WAGMI]: [WAVAX[ChainId.WAGMI], PNG[ChainId.WAGMI]],
  [ChainId.COSTON]: [WAVAX[ChainId.COSTON], PNG[ChainId.COSTON]]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.AVALANCHE]: {}
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WAVAX_AND_PNG_ONLY
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WAVAX_AND_PNG_ONLY
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.AVALANCHE]: []
}

// these tokens can be directly linked to (via url params) in the swap page without prompting a warning
export const TRUSTED_TOKEN_ADDRESSES: { readonly [chainId in ChainId]: string[] } = {
  [ChainId.FUJI]: [],
  [ChainId.AVALANCHE]: [WAVAX[ChainId.AVALANCHE].address, PNG[ChainId.AVALANCHE].address],
  [ChainId.WAGMI]: [WAVAX[ChainId.WAGMI].address, PNG[ChainId.WAGMI].address],
  [ChainId.COSTON]: [WAVAX[ChainId.COSTON].address, PNG[ChainId.COSTON].address]
}

export const SWAP_DEFAULT_CURRENCY = {
  [ChainId.AVALANCHE]: {
    inputCurrency: 'AVAX',
    outputCurrency: UST[ChainId.AVALANCHE].address
  },
  [ChainId.FUJI]: {
    inputCurrency: '',
    outputCurrency: ''
  },
  [ChainId.WAGMI]: {
    inputCurrency: '',
    outputCurrency: ''
  },
  [ChainId.COSTON]: {
    inputCurrency: '',
    outputCurrency: ''
  }
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  GNOSISSAFE: {
    connector: gnosisSafe,
    name: 'Gnosis Safe',
    iconName: 'gnosis_safe.png',
    description: 'Gnosis Safe Multisig Wallet.',
    href: null,
    color: '#010101'
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'walletConnectIcon.svg',
    description: 'Use Wallet Connect',
    href: null,
    color: '#315CF5'
  },
  XDEFI: {
    connector: xDefi,
    name: 'XDEFI Wallet',
    iconName: 'xDefi.png',
    description: window.xfi && window.xfi.ethereum ? 'Easy-to-use browser extension.' : 'Please Install',
    href: null,
    color: '#315CF5'
  },
  RABBY: {
    connector: injected,
    name: 'Rabby Wallet',
    iconName: 'rabby.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#7a7cff'
  }
}

export const NetworkContextName = 'NETWORK'

export const AVALANCHE_CHAIN_PARAMS = {
  chainId: '0xa86a', // A 0x-prefixed hexadecimal chainId
  chainName: 'Avalanche Mainnet C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io//']
}

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 10 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 10 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_TWO = JSBI.BigInt(2)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const BIG_INT_EIGHTEEN = JSBI.BigInt(18)
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)
export const ONE_TOKEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export const MOONPAY_PK = process.env.REACT_APP_MOONPAY_PK || ''
export const WYRE_API_KEY = process.env.REACT_APP_WYRE_API_KEY ? process.env.REACT_APP_WYRE_API_KEY : ''
export const WYRE_SECRET_KEY = process.env.REACT_APP_WYRE_SECRET_KEY ? process.env.REACT_APP_WYRE_SECRET_KEY : ''
export const WYRE_ID = process.env.REACT_APP_WYRE_ID ? process.env.REACT_APP_WYRE_ID : ''
export const WYRE_API_URL = 'https://api.sendwyre.com'
export const WYRE_QUOTE_API_ENDPOINT = '/v3/orders/quote/partner'
export const WYRE_RESERVE_API_ENDPOINT = '/v3/orders/reserve'
export const WYRE_CALLBACK_URL = 'https://app.pangolin.exchange/'
export const SUBGRAPH_BASE_URL = process.env.REACT_APP_SUBGRAPH_BASE_URL

export const IS_IN_IFRAME = window.parent !== window
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

export enum BETA_MENU_LINK {
  dashboard = '/beta/dashboard',
  swap = '/beta/swap',
  buy = '/beta/buy',
  pool = '/beta/pool',
  stake = '/beta/stake',
  vote = '/beta/vote',
  migrate = '/beta/migrate',
  bridge = '/beta/bridge',
  airdrop = '/beta/airdrop'
}

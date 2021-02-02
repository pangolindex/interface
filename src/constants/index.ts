import { ChainId, JSBI, Percent, Token, WAVAX } from '@pangolindex/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected } from '../connectors'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
  [ChainId.AVALANCHE]: '0x44771c71250D303d32E638c1c7ca7d00135cd65f'
}

export const LANDING_PAGE = 'https://pangoon-landing.netlify.app/'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xa79FD4Aa2bdD5Df395Ad82FA61dB2B2201244188', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'PNG', 'Pangolin')
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x34B6C87bb59Eb37EFe35C8d594a234Cd8C654D50', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin')
}

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xf4E0A9224e8827dE91050b528F34e2F99C82Fbf6', 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'UNI', 'Uniswap')
}

export const JOE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xEa81F6972aDf76765Fd1435E119Acc0Aafc80BeA', 18, 'JOE', 'JOE'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'JOE', 'JOE')
}

export const SUSHI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x72C14f7fB8B14040dA6E5b1B9D1B9438ebD85F58', 18, 'SUSHI', 'SushiSwap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'SUSHI', 'SushiSwap')
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: '0xD7d465156a1D94bC774b5Cd4B2e4Ee7a7c38F801'
}

const WAVAX_ONLY: ChainTokenList = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [WAVAX[ChainId.AVALANCHE]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.AVALANCHE]: {

  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WAVAX_ONLY,
  [ChainId.AVALANCHE]: [...WAVAX_ONLY[ChainId.AVALANCHE]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.AVALANCHE]: [
  ]
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
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)

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

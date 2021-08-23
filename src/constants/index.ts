import { ChainId, JSBI, Percent, Token, WAVAX } from '@pangolindex/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletlink } from '../connectors'

export const GAS_PRICE = 225;

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
  [ChainId.AVALANCHE]: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106'
}

export const LANDING_PAGE = 'https://pangolin.exchange/'
export const ANALYTICS_PAGE = 'https://info.pangolin.exchange/'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1'

export const BRIDGE_MIGRATOR_ADDRESS = '0x4b23Aa72A1214d0E4fd3f2c8Da7C6ba660F7483C'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x83080D4b5fC60e22dFFA8d14AD3BB41Dde48F199', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
}

export const ETH: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ETH', 'Ether'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
}

export const WETHe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WETH.e', 'Ether'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH.e', 'Ether')
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'USDT', 'Tether USD')
}

export const USDTe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT.e', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xc7198437980c041c805A1EDcbA50c1Ce5db95118', 6, 'USDT.e', 'Tether USD')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB', 8, 'WBTC', 'Wrapped Bitcoin')
}

export const WBTCe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC.e', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC.e', 'Wrapped Bitcoin')
}

export const LINK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LINK', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651', 18, 'LINK', 'ChainLink Token')
}

export const LINKe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LINK.e', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x5947BB275c521040051D82396192181b413227A3', 18, 'LINK.e', 'ChainLink Token')
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'DAI', 'Dai Stablecoin')
}

export const DAIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DAI.e', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI.e', 'Dai Stablecoin')
}

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab', 18, 'UNI', 'Uniswap')
}

export const UNIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UNI.e', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580', 18, 'UNI.e', 'Uniswap')
}

export const SUSHI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SUSHI', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc', 18, 'SUSHI', 'SushiToken')
}

export const SUSHIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SUSHI.e', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76', 18, 'SUSHI.e', 'SushiToken')
}

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9', 18, 'AAVE', 'Aave Token')
}

export const AAVEe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE.e', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x63a72806098Bd3D9520cC43356dD78afe5D386D9', 18, 'AAVE.e', 'Aave Token')
}

export const YFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YFI', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x99519AcB025a0e0d44c3875A4BbF03af65933627', 18, 'YFI', 'yearn.finance')
}

export const YFIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YFI.e', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x9eAaC1B23d935365bD7b542Fe22cEEe2922f52dc', 18, 'YFI.e', 'yearn.finance')
}

export const SNOB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xF319e2f610462F846d6e93F51CdC862EEFF2a554', 18, 'SNOB', 'Snowball'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xC38f41A296A4493Ff429F1238e030924A1542e50', 18, 'SNOB', 'Snowball')
}

export const VSO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'VSO', 'VersoToken'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a', 18, 'VSO', 'VersoToken')
}

export const SPORE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'SPORE', 'Spore.Finance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985', 9, 'SPORE', 'Spore.Finance')
}

// Bridged via anyswap
export const BIFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BIFI', 'beefy.finance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xd6070ae98b8069de6B494332d1A1a81B6179D960', 18, 'BIFI', 'beefy.finance')
}

// Bridged via anyswap
export const BNB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x264c1383EA520f73dd837F915ef3a732e204a493', 18, 'BNB', 'Binance')
}

export const XAVA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'XAVA', 'Avalaunch'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4', 18, 'XAVA', 'Avalaunch')
}

export const PEFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'PEFI', 'PenguinToken'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c', 18, 'PEFI', 'PenguinToken')
}

export const TRYB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'TRYB', 'BiLira'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x564A341Df6C126f90cf3ECB92120FD7190ACb401', 6, 'TRYB', 'BiLira')
}

export const SHERPA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SHERPA', 'Sherpa'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xa5E59761eBD4436fa4d20E1A27cBa29FB2471Fc6', 18, 'SHERPA', 'Sherpa')
}

export const YAK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YAK', 'Yak Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7', 18, 'YAK', 'Yak Token')
}

export const QI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'QI', 'BENQI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5', 18, 'QI', 'BENQI')
}

export const DYP: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DYP', 'DeFiYieldProtocol'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17', 18, 'DYP', 'DeFiYieldProtocol')
}

export const WALBT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WALBT', 'Wrapped AllianceBlock Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x9E037dE681CaFA6E661e6108eD9c2bd1AA567Ecd', 18, 'WALBT', 'Wrapped AllianceBlock Token')
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: '0x0C58C2041da4CfCcF5818Bbe3b66DBC23B3902d9'
}

const WAVAX_AND_PNG_ONLY: ChainTokenList = {
  [ChainId.FUJI]: [WAVAX[ChainId.FUJI], PNG[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WAVAX_AND_PNG_ONLY,
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
  ...WAVAX_AND_PNG_ONLY,
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WAVAX_AND_PNG_ONLY,
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
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
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
  blockExplorerUrls: ['https://cchain.explorer.avax.network/']
}

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

export const WYRE_API_KEY = process.env.REACT_APP_WYRE_API_KEY ? process.env.REACT_APP_WYRE_API_KEY : ''
export const WYRE_SECRET_KEY = process.env.REACT_APP_WYRE_SECRET_KEY ? process.env.REACT_APP_WYRE_SECRET_KEY : ''
export const WYRE_ID = process.env.REACT_APP_WYRE_ID ? process.env.REACT_APP_WYRE_ID : ''
export const WYRE_API_URL = 'https://api.sendwyre.com'
export const WYRE_QUOTE_API_ENDPOINT = '/v3/orders/quote/partner'
export const WYRE_RESERVE_API_ENDPOINT = '/v3/orders/reserve'
export const WYRE_CALLBACK_URL = 'https://app.pangolin.exchange/'
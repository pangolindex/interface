import { ChainId, Token } from '@antiyro/sdk'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x83080D4b5fC60e22dFFA8d14AD3BB41Dde48F199', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x60781C2586D68229fde47564546784ab3fACA982',
    18,
    'PNG',
    'Pangolin'
  ),
  [ChainId.WAGMI]: new Token(
    ChainId.WAGMI,
    '0x25dbCAb8709E6222d74a56bD0184fc41439806CE',
    18,
    'wagmiPNG',
    'Wagmi Pangolin'
  )
}

export const OG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'OG', 'OG'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'OG', 'OG'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, '0xf1db872E6454D553686b088c1Ea3889cF2FE3ABe', 18, 'OG', 'OG')
}

export const wWAGMI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'OG', 'OG'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'OG', 'OG'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, '0x3Ee7094DADda15810F191DD6AcF7E4FFa37571e4', 18, 'wWAGMI', 'Wrapped WAGMI')
}

export const ETH: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ETH', 'Ether'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ETH', 'Ether')
}

export const WETHe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WETH.e', 'Ether'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    18,
    'WETH.e',
    'Ether'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'WETH.e', 'Ether')
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xde3A24028580884448a5397872046a019649b084',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD')
}

export const USDTe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT.e', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    6,
    'USDT.e',
    'Tether USD'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'USDT.e', 'Tether USD')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin')
}

export const WBTCe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC.e', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x50b7545627a5162F82A992c33b87aDc75187B218',
    8,
    'WBTC.e',
    'Wrapped Bitcoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 8, 'WBTC.e', 'Wrapped Bitcoin')
}

export const LINK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LINK', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651',
    18,
    'LINK',
    'ChainLink Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LINK', 'ChainLink Token')
}

export const LINKe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LINK.e', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x5947BB275c521040051D82396192181b413227A3',
    18,
    'LINK.e',
    'ChainLink Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LINK.e', 'ChainLink Token')
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin')
}

export const DAIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DAI.e', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    18,
    'DAI.e',
    'Dai Stablecoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DAI.e', 'Dai Stablecoin')
}

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab', 18, 'UNI', 'Uniswap'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'UNI', 'Uniswap')
}

export const UNIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UNI.e', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580',
    18,
    'UNI.e',
    'Uniswap'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'UNI.e', 'Uniswap')
}

export const SUSHI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SUSHI', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc',
    18,
    'SUSHI',
    'SushiToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SUSHI', 'SushiToken')
}

export const SUSHIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SUSHI.e', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76',
    18,
    'SUSHI.e',
    'SushiToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SUSHI.e', 'SushiToken')
}

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9',
    18,
    'AAVE',
    'Aave Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AAVE', 'Aave Token')
}

export const AAVEe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE.e', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
    18,
    'AAVE.e',
    'Aave Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AAVE.e', 'Aave Token')
}

export const YFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YFI', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x99519AcB025a0e0d44c3875A4BbF03af65933627',
    18,
    'YFI',
    'yearn.finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YFI', 'yearn.finance')
}

export const YFIe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YFI.e', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9eAaC1B23d935365bD7b542Fe22cEEe2922f52dc',
    18,
    'YFI.e',
    'yearn.finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YFI.e', 'yearn.finance')
}

export const SNOB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0xF319e2f610462F846d6e93F51CdC862EEFF2a554', 18, 'SNOB', 'Snowball'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xC38f41A296A4493Ff429F1238e030924A1542e50',
    18,
    'SNOB',
    'Snowball'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SNOB', 'Snowball')
}

export const VSO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'VSO', 'VersoToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a',
    18,
    'VSO',
    'VersoToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'VSO', 'VersoToken')
}

export const SPORE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'SPORE', 'Spore.Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985',
    9,
    'SPORE',
    'Spore.Finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 9, 'SPORE', 'Spore.Finance')
}

// Bridged via anyswap
export const BIFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BIFI', 'beefy.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd6070ae98b8069de6B494332d1A1a81B6179D960',
    18,
    'BIFI',
    'beefy.finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BIFI', 'beefy.finance')
}

// Bridged via anyswap
export const BNB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x264c1383EA520f73dd837F915ef3a732e204a493', 18, 'BNB', 'Binance'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BNB', 'Binance')
}

export const XAVA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'XAVA', 'Avalaunch'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4',
    18,
    'XAVA',
    'Avalaunch'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'XAVA', 'Avalaunch')
}

export const PEFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'PEFI', 'PenguinToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c',
    18,
    'PEFI',
    'PenguinToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'PEFI', 'PenguinToken')
}

export const TRYB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'TRYB', 'BiLira'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x564A341Df6C126f90cf3ECB92120FD7190ACb401', 6, 'TRYB', 'BiLira'),
  [ChainId.WAGMI]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 6, 'TRYB', 'BiLira')
}

export const SHERPA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SHERPA', 'Sherpa'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xa5E59761eBD4436fa4d20E1A27cBa29FB2471Fc6',
    18,
    'SHERPA',
    'Sherpa'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SHERPA', 'Sherpa')
}

export const YAK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YAK', 'Yak Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7',
    18,
    'YAK',
    'Yak Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YAK', 'Yak Token')
}

export const QI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'QI', 'BENQI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5', 18, 'QI', 'BENQI'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'QI', 'BENQI')
}

export const DYP: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DYP', 'DeFiYieldProtocol'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17',
    18,
    'DYP',
    'DeFiYieldProtocol'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DYP', 'DeFiYieldProtocol')
}

export const WALBT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WALBT', 'Wrapped AllianceBlock Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9E037dE681CaFA6E661e6108eD9c2bd1AA567Ecd',
    18,
    'WALBT',
    'Wrapped AllianceBlock Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'WALBT', 'Wrapped AllianceBlock Token')
}

export const HUSKY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HUSKY', 'Husky'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x65378b697853568dA9ff8EaB60C13E1Ee9f4a654', 18, 'HUSKY', 'Husky'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HUSKY', 'Husky')
}

export const USDCe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    6,
    'USDC.e',
    'USD Coin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin')
}

export const LYD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LYD', 'LydiaFinance Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084',
    18,
    'LYD',
    'LydiaFinance Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LYD', 'LydiaFinance Token')
}

export const TUSD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TUSD', 'TrueUSD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x1C20E891Bab6b1727d14Da358FAe2984Ed9B59EB',
    18,
    'TUSD',
    'TrueUSD'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TUSD', 'TrueUSD')
}

export const GAJ: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'GAJ', 'PolyGaj Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x595c8481c48894771CE8FaDE54ac6Bf59093F9E8',
    18,
    'GAJ',
    'PolyGaj Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'GAJ', 'PolyGaj Token')
}

export const GDL: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'GDL', 'Gondola'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xD606199557c8Ab6F4Cc70bD03FaCc96ca576f142', 18, 'GDL', 'Gondola'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'GDL', 'Gondola')
}

export const MFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MFI', 'MarginSwap'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9Fda7cEeC4c18008096C2fE2B85F05dc300F94d0',
    18,
    'MFI',
    'MarginSwap'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MFI', 'MarginSwap')
}

export const SHIBX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SHIBX', 'SHIBAVAX'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x440aBbf18c54b2782A4917b80a1746d3A2c2Cce1',
    18,
    'SHIBX',
    'SHIBAVAX'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SHIBX', 'SHIBAVAX')
}

export const AVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AVE', 'Avaware'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x78ea17559B3D2CF85a7F9C2C704eda119Db5E6dE', 18, 'AVE', 'Avaware'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AVE', 'Avaware')
}

export const ELE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ELE', 'Eleven.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0',
    18,
    'ELE',
    'Eleven.finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ELE', 'Eleven.finance')
}

export const FRAX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FRAX', 'Frax'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xDC42728B0eA910349ed3c6e1c9Dc06b5FB591f98', 18, 'FRAX', 'Frax'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'FRAX', 'Frax')
}

export const FXS: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FXS', 'Frax Share'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    18,
    'FXS',
    'Frax Share'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'FXS', 'Frax Share')
}

export const START: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'START', 'Starter'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xF44Fb887334Fa17d2c5c0F970B5D320ab53eD557',
    18,
    'START',
    'Starter'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'START', 'Starter')
}

export const SWAPe: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SWAP.e', 'TrustSwap Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc7B5D72C836e718cDA8888eaf03707fAef675079',
    18,
    'SWAP.e',
    'TrustSwap Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SWAP.e', 'TrustSwap Token')
}

export const YTS: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YTS', 'YetiSwap'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x488F73cddDA1DE3664775fFd91623637383D6404',
    18,
    'YTS',
    'YetiSwap'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YTS', 'YetiSwap')
}

export const TUNDRA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TUNDRA', 'TUNDRA Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x21c5402C3B7d40C89Cc472C9dF5dD7E51BbAb1b1',
    18,
    'TUNDRA',
    'TUNDRA Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TUNDRA', 'TUNDRA Token')
}

export const XUSD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'xUSD', 'xDollar Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x3509f19581aFEDEff07c53592bc0Ca84e4855475',
    18,
    'xUSD',
    'xDollar Stablecoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'xUSD', 'xDollar Stablecoin')
}

export const XDO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'XDO', 'xDollar'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x9eF758aC000a354479e538B8b2f01b917b8e89e7', 18, 'XDO', 'xDollar'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'XDO', 'xDollar')
}

export const JOE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'JOE', 'JOE Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
    18,
    'JOE',
    'JOE Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'JOE', 'JOE Token')
}

export const ZABU: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZABU', 'ZABU Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xDd453dBD253fA4E5e745047d93667Ce9DA93bbCF',
    18,
    'ZABU',
    'ZABU Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ZABU', 'ZABU Token')
}

export const YAY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YAY', 'YAY Games'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x01C2086faCFD7aA38f69A6Bd8C91BEF3BB5adFCa',
    18,
    'YAY',
    'YAY Games'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YAY', 'YAY Games')
}

export const STORM: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'STORM', 'STORM Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x6AFD5A1ea4b793CC1526d6Dc7e99A608b356eF7b',
    18,
    'STORM',
    'STORM Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'STORM', 'STORM Token')
}

export const OOE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'OOE', 'OpenOcean'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0ebd9537A25f56713E34c45b38F421A1e7191469',
    18,
    'OOE',
    'OpenOcean'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'OOE', 'OpenOcean')
}

export const VEE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'VEE', 'Vee'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x3709E8615E02C15B096f8a9B460ccb8cA8194e86', 18, 'VEE', 'Vee'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'VEE', 'Vee')
}

export const AVXT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'AVXT', 'Avaxtars'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x397bBd6A0E41bdF4C3F971731E180Db8Ad06eBc1',
    6,
    'AVXT',
    'Avaxtars'
  ),
  [ChainId.WAGMI]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 6, 'AVXT', 'Avaxtars')
}

export const OLIVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'OLIVE', 'Olive Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x617724974218A18769020A70162165A539c07E8a',
    18,
    'OLIVE',
    'Olive Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'OLIVE', 'Olive Token')
}

export const APEIN: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'APEIN', 'Ape In'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x938FE3788222A74924E062120E7BFac829c719Fb',
    18,
    'APEIN',
    'Ape In'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'APEIN', 'Ape In')
}

export const GB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'GB', 'Good Bridging'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x90842eb834cFD2A1DB0b1512B254a18E4D396215',
    9,
    'GB',
    'Good Bridging'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 9, 'GB', 'Good Bridging')
}

export const CNR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'CNR', 'Canary'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf', 18, 'CNR', 'Canary'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'CNR', 'Canary')
}

export const CYCLE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'CYCLE', 'Cycle'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x81440C939f2C1E34fc7048E518a637205A632a74', 18, 'CYCLE', 'Cycle'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'CYCLE', 'Cycle')
}

export const IronICE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'IronICE', 'Iron Finance ICE'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xfC108f21931576a21D0b4b301935DAc80d9E5086',
    18,
    'IronICE',
    'Iron Finance ICE'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'IronICE', 'Iron Finance ICE')
}

export const MYAK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 12, 'mYAK', 'MiniYAK'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xdDAaAD7366B455AfF8E7c82940C43CEB5829B604',
    12,
    'mYAK',
    'MiniYAK'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 12, 'mYAK', 'MiniYAK')
}

export const WOW: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WOW', 'WOWswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xA384Bc7Cdc0A93e686da9E7B8C0807cD040F4E0b', 18, 'WOW', 'WOWswap'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'WOW', 'WOWswap')
}

export const TEDDY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TEDDY', 'TEDDY'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x094bd7B2D99711A1486FB94d4395801C6d0fdDcC', 18, 'TEDDY', 'TEDDY'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TEDDY', 'TEDDY')
}

export const TSD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TSD', 'TSD Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x4fbf0429599460D327BD5F55625E30E4fC066095',
    18,
    'TSD',
    'TSD Stablecoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TSD', 'TSD Stablecoin')
}

export const EVRT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'EVRT', 'Everest Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x3ACa5545e76746A3Fe13eA66B24BC0eBcC51E6b4',
    18,
    'EVRT',
    'Everest Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'EVRT', 'Everest Token')
}

export const RAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'RAI', 'Rai Reflex Index'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x97Cd1CFE2ed5712660bb6c14053C0EcB031Bff7d',
    18,
    'RAI',
    'Rai Reflex Index'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'RAI', 'Rai Reflex Index')
}

export const AAVAXB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'aAVAXb', 'Ankr AVAX Bond'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x6C6f910A79639dcC94b4feEF59Ff507c2E843929',
    18,
    'aAVAXb',
    'Ankr AVAX Bond'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'aAVAXb', 'Ankr AVAX Bond')
}

export const INSUR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'INSUR', 'InsurAce Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x544c42fBB96B39B21DF61cf322b5EDC285EE7429',
    18,
    'INSUR',
    'InsurAce Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'INSUR', 'InsurAce Token')
}

export const AVME: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AVME', 'AVME'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x1ECd47FF4d9598f89721A2866BFEb99505a413Ed', 18, 'AVME', 'AVME'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AVME', 'AVME')
}

export const TIME: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'TIME', 'Time'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xb54f16fB19478766A268F172C9480f8da1a7c9C3', 9, 'TIME', 'Time'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 9, 'TIME', 'Time')
}

export const HCT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HCT', 'Hurricane Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x45C13620B55C35A5f539d26E88247011Eb10fDbd',
    18,
    'HCT',
    'Hurricane Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HCT', 'Hurricane Token')
}

export const FRAXV2: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FRAX', 'Frax'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64', 18, 'FRAX', 'Frax'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'FRAX', 'Frax')
}

export const ROCO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ROCO', 'ROCO'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xb2a85C5ECea99187A977aC34303b80AcbDdFa208', 18, 'ROCO', 'ROCO'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ROCO', 'ROCO')
}

export const IMX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'IMX', 'IMX'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef', 18, 'IMX', 'IMX'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'IMX', 'IMX')
}

export const AMPL: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'AMPL', 'Ampleforth'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x027dbcA046ca156De9622cD1e2D907d375e53aa7',
    9,
    'AMPL',
    'Ampleforth'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 9, 'AMPL', 'Ampleforth')
}

export const ORBS: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ORBS', 'Orbs'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x340fE1D898ECCAad394e2ba0fC1F93d27c7b717A', 18, 'ORBS', 'Orbs'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ORBS', 'Orbs')
}

export const SPELL: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SPELL', 'Spell Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xCE1bFFBD5374Dac86a2893119683F4911a2F7814',
    18,
    'SPELL',
    'Spell Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SPELL', 'Spell Token')
}

export const KLO: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'KLO', 'Kalao Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xb27c8941a7Df8958A1778c0259f76D1F8B711C35',
    18,
    'KLO',
    'Kalao Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'KLO', 'Kalao Token')
}

export const MIM: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MIM', 'Magic Internet Money'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x130966628846BFd36ff31a822705796e8cb8C18D',
    18,
    'MIM',
    'Magic Internet Money'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MIM', 'Magic Internet Money')
}

export const gOHM: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'gOHM', 'Governance OHM'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x321E7092a180BB43555132ec53AaA65a5bF84251',
    18,
    'gOHM',
    'Governance OHM'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'gOHM', 'Governance OHM')
}

export const CRA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'CRA', 'Crabada'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed', 18, 'CRA', 'Crabada'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'CRA', 'Crabada')
}

export const CRAFT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'CRAFT', 'CRAFT'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x8aE8be25C23833e0A01Aa200403e826F611f9CD2', 18, 'CRAFT', 'CRAFT'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'CRAFT', 'CRAFT')
}

export const MAXI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 9, 'MAXI', 'Maximizer'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x7C08413cbf02202a1c13643dB173f2694e0F73f0',
    9,
    'MAXI',
    'Maximizer'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MAXI', 'Maximizer')
}

export const AVAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AVAI', 'AVAI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x346A59146b9b4a77100D369a3d18E8007A9F46a6', 18, 'AVAI', 'AVAI'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AVAI', 'AVAI')
}

export const ORCA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ORCA', 'OrcaDAO'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x8B1d98A91F853218ddbb066F20b8c63E782e2430',
    18,
    'ORCA',
    'OrcaDAO'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ORCA', 'OrcaDAO')
}

export const JEWEL: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'JEWEL', 'Jewels'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6',
    18,
    'JEWEL',
    'Jewels'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'JEWEL', 'Jewels')
}

export const NFTD: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'NFTD', 'NFTrade Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9E3Ca00f2d4A9E5d4f0add0900de5f15050812cF',
    18,
    'NFTD',
    'NFTrade Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'NFTD', 'NFTrade Token')
}

export const CLY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'CLY', 'Colony Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xec3492a2508DDf4FDc0cD76F31f340b30d1793e6',
    18,
    'CLY',
    'Colony Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'CLY', 'Colony Token')
}

export const COOK: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'COOK', 'Cook Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x637afeff75ca669fF92e4570B14D6399A658902f',
    18,
    'COOK',
    'Cook Finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'COOK', 'Cook Finance')
}

export const SKILL: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SKILL', 'Skill Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x483416eB3aFA601B9C6385f63CeC0C82B6aBf1fb',
    18,
    'SKILL',
    'Skill Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'SKILL', 'Skill Token')
}

export const TUS: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TUS', 'Treasure Under Sea'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xf693248F96Fe03422FEa95aC0aFbBBc4a8FdD172',
    18,
    'TUS',
    'Treasure Under Sea'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TUS', 'Treasure Under Sea')
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    6,
    'USDC',
    'USD Coin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'USDC', 'USD Coin')
}

export const HSHARES: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HSHARES', 'HERMES Shares'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xfa4B6db72A650601E7Bd50a0A9f537c9E98311B2',
    18,
    'HSHARES',
    'HERMES Shares'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HSHARES', 'HERMES Shares')
}

export const HERMES: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HERMES', 'HERMES'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB15f02F9Da8CD1f99E9dd375F21dc96D25ddd82C',
    18,
    'HERMES',
    'HERMES'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HERMES', 'HERMES')
}

export const PTP: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'PTP', 'Platypus'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x22d4002028f537599bE9f666d1c4Fa138522f9c8',
    18,
    'PTP',
    'Platypus'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'PTP', 'Platypus')
}

export const ISA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ISA', 'Islander'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x3EeFb18003D033661f84e48360eBeCD181A84709',
    18,
    'ISA',
    'Islander'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ISA', 'Islander')
}

export const ICE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ICE', 'Ice Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xe0Ce60AF0850bF54072635e66E79Df17082A1109',
    18,
    'ICE',
    'Ice Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ICE', 'Ice Token')
}

export const iDYP: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'iDYP', 'iDefi Yield Protocol'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xBD100d061E120b2c67A24453CF6368E63f1Be056',
    18,
    'iDYP',
    'iDefi Yield Protocol'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'iDYP', 'iDefi Yield Protocol')
}

export const BOOFI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BOOFI', 'Boo Finance Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0',
    18,
    'BOOFI',
    'Boo Finance Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BOOFI', 'Boo Finance Token')
}

export const LOOT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LOOT', 'LOOT Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x7f041ce89a2079873693207653b24c15b5e6a293',
    18,
    'LOOT',
    'LOOT Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LOOT', 'LOOT Token')
}

export const FEED: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FEED', 'Chikn feed'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xab592d197acc575d16c3346f4eb70c703f308d1e',
    18,
    'FEED',
    'Chikn feed'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'FEED', 'Chikn feed')
}

export const DCAU: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DCAU', 'Dragon Crypto Aurum'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x100cc3a819dd3e8573fd2e46d1e66ee866068f30',
    18,
    'DCAU',
    'Dragon Crypto Aurum'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DCAU', 'Dragon Crypto Aurum')
}

export const agEUR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'agEUR', 'agEUR'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x6fefd97f328342a8a840546a55fdcfee7542f9a8', 18, 'agEUR', 'agEUR'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'agEUR', 'agEUR')
}

export const MAGE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MAGE', 'MetaBrands'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x921f99719eb6c01b4b8f0ba7973a7c24891e740a',
    18,
    'MAGE',
    'MetaBrands'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MAGE', 'MetaBrands')
}

export const HTZ: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HTZ', 'Hertz Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x9C8E99eb130AED653Ef90fED709D9C3E9cC8b269',
    18,
    'HTZ',
    'Hertz Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HTZ', 'Hertz Token')
}

export const PLN: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'PLN', 'Pollen'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x7b2b702706d9b361dfe3f00bd138c0cfda7fb2cf', 18, 'PLN', 'Pollen'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'PLN', 'Pollen')
}

export const HEC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'HeC', 'HeroesChained'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc7f4debc8072e23fe9259a5c0398326d8efb7f5c',
    18,
    'HeC',
    'HeroesChained'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'HeC', 'HeroesChained')
}

export const axlUST: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'axlUST', 'Axelar Wrapped UST'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11',
    6,
    'axlUST',
    'Axelar Wrapped UST'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'axlUST', 'Axelar Wrapped UST')
}

export const LUNA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'LUNA', 'Axelar Wrapped LUNA'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x120AD3e5A7c796349e591F1570D9f7980F4eA9cb',
    6,
    'LUNA',
    'Axelar Wrapped LUNA'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LUNA', 'Axelar Wrapped LUNA')
}

export const IME: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'IME', 'Imperium Empires Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xF891214fdcF9cDaa5fdC42369eE4F27F226AdaD6',
    18,
    'IME',
    'Imperium Empires Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'IME', 'Imperium Empires Token')
}

export const MONEY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MONEY', 'Moremoney USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0f577433Bf59560Ef2a79c124E9Ff99fCa258948',
    18,
    'MONEY',
    'Moremoney USD'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MONEY', 'Moremoney USD')
}

export const YDR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'YDR', 'YDragon'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xf03Dccaec9A28200A6708c686cf0b8BF26dDc356', 18, 'YDR', 'YDragon'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'YDR', 'YDragon')
}

export const RACEX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'RACEX', 'RaceX'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x7086e045b78e1e72f741f25231c08d238812cf8a', 18, 'RACEX', 'RaceX'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'RACEX', 'RaceX')
}

export const FIRE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FIRE', 'FIRE'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xfcc6CE74f4cd7eDEF0C5429bB99d38A3608043a5', 18, 'FIRE', 'FIRE'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'FIRE', 'FIRE')
}

export const BAVA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BAVA', 'BavaToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xe19A1684873faB5Fb694CfD06607100A632fF21c',
    18,
    'BAVA',
    'BavaToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BAVA', 'BavaToken')
}

export const BRIBE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BRIBE', 'BRIBE'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xCe2fbed816E320258161CeD52c2d0CEBcdFd8136', 18, 'BRIBE', 'BRIBE'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BRIBE', 'BRIBE')
}

export const AGF: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AGF', 'Augmented Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xb67a9374Da03d4114a6FB8f0E7F2b82b5cB34ee3',
    18,
    'AGF',
    'Augmented Finance'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'AGF', 'Augmented Finance')
}

export const ODDZ: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ODDZ', 'OddzToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB0a6e056B587D0a85640b39b1cB44086F7a26A1E',
    18,
    'ODDZ',
    'OddzToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ODDZ', 'OddzToken')
}

export const DLAUNCH: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DLAUNCH', 'DefiLaunch Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0659133127749Cc0616Ed6632912ddF7cc8D7545',
    18,
    'DLAUNCH',
    'DefiLaunch Token'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DLAUNCH', 'DefiLaunch Token')
}

export const ACRE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ACRE', 'Arable Protocol'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x00EE200Df31b869a321B10400Da10b561F3ee60d',
    18,
    'ACRE',
    'Arable Protocol'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ACRE', 'Arable Protocol')
}

export const sAVAX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'sAVAX', 'Staked AVAX'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE',
    18,
    'sAVAX',
    'Staked AVAX'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'sAVAX', 'Staked AVAX')
}

export const DEP: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DEP', 'DEAPCOIN'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xD4d026322C88C2d49942A75DfF920FCfbC5614C1',
    18,
    'DEP',
    'DEAPCOIN'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DEP', 'DEAPCOIN')
}

export const ZEE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZEE', 'ZeroSwapToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x44754455564474A89358B2C2265883DF993b12F0',
    18,
    'ZEE',
    'ZeroSwapToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ZEE', 'ZeroSwapToken')
}

export const TOMB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TOMB', 'TOMB'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xb84527D59b6Ecb96F433029ECc890D4492C5dCe1', 18, 'TOMB', 'TOMB'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'TOMB', 'TOMB')
}

export const MAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MAI', 'Mai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b',
    18,
    'MAI',
    'Mai Stablecoin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'MAI', 'TOMai StablecoinMB')
}

export const BUSINESSES: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BUSINESSES', '$BUSINESSES'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x15c841043e13fFAA9a99FabEa236D40F45615623',
    18,
    'BUSINESSES',
    '$BUSINESSES'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'BUSINESSES', '$BUSINESSES')
}

export const DOLLA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DOLLA', '$dolla'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x4B322765D761984C0f9E72200B62a9b445F38caC',
    18,
    'DOLLA',
    '$dolla'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'DOLLA', '$dolla')
}

export const NCASH: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ncash', 'NitroNetwork'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc69Eba65e87889f0805dB717Af06797055A0BA07',
    18,
    'ncash',
    'NitroNetwork'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ncash', 'NitroNetwork')
}

export const KACY: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'KACY', 'Kassandra'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xf32398dae246C5f672B52A54e9B413dFFcAe1A44',
    18,
    'KACY',
    'Kassandra'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'KACY', 'Kassandra')
}

export const OML: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'OML', 'Omlira'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x979fFD8eEd7a43629eA29581DF4Bfe2b3F224e47', 18, 'OML', 'Omlira'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'OML', 'Omlira')
}

export const JPYC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'JPYC', 'JPY Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB',
    18,
    'JPYC',
    'JPY Coin'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'JPYC', 'JPY Coin')
}

export const UST: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'UST', 'Wormhole UST'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xb599c3590F42f8F995ECfa0f85D2980B76862fc1',
    6,
    'UST',
    'Wormhole UST'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'UST', 'Wormhole UST')
}

export const axlATOM: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'axlATOM', 'Axelar Wrapped ATOM'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x80D18b1c9Ab0c9B5D6A6d5173575417457d00a12',
    6,
    'axlATOM',
    'Axelar Wrapped ATOM'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'axlATOM', 'Axelar Wrapped ATOM')
}

export const LOST: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LOST', 'LostToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x449674B82F05d498E126Dd6615a1057A9c088f2C',
    18,
    'LOST',
    'LostToken'
  ),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'LOST', 'LostToken')
}

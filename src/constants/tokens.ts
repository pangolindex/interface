import { ChainId, Token, CHAINS } from '@pangolindex/sdk'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    CHAINS[ChainId.FUJI].contracts!.png,
    18,
    CHAINS[ChainId.FUJI].png_symbol,
    'Pangolin'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    CHAINS[ChainId.AVALANCHE].contracts!.png,
    18,
    CHAINS[ChainId.AVALANCHE].png_symbol,
    'Pangolin'
  ),
  [ChainId.WAGMI]: new Token(
    ChainId.WAGMI,
    CHAINS[ChainId.WAGMI].contracts!.png,
    18,
    CHAINS[ChainId.WAGMI].png_symbol,
    'Wagmi Pangolin'
  ),
  [ChainId.COSTON]: new Token(
    ChainId.COSTON,
    CHAINS[ChainId.COSTON].contracts!.png,
    18,
    CHAINS[ChainId.COSTON].png_symbol,
    'Coston Pangolin'
  ),
  [ChainId.NEAR_MAINNET]: new Token(
    ChainId.NEAR_MAINNET,
    CHAINS[ChainId.NEAR_MAINNET].contracts!.png,
    18,
    CHAINS[ChainId.NEAR_MAINNET].png_symbol,
    'Pangolin Near'
  ),
  [ChainId.NEAR_TESTNET]: new Token(
    ChainId.NEAR_TESTNET,
    CHAINS[ChainId.NEAR_TESTNET].contracts!.png,
    18,
    CHAINS[ChainId.NEAR_TESTNET].png_symbol,
    'Pangolin Near'
  )
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
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'APEIN', 'Ape In'),
  [ChainId.COSTON]: new Token(ChainId.COSTON, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_MAINNET]: new Token(ChainId.NEAR_MAINNET, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_TESTNET]: new Token(ChainId.NEAR_TESTNET, ZERO_ADDRESS, 18, '', '')
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
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'OOE', 'OpenOcean'),
  [ChainId.COSTON]: new Token(ChainId.COSTON, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_MAINNET]: new Token(ChainId.NEAR_MAINNET, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_TESTNET]: new Token(ChainId.NEAR_TESTNET, ZERO_ADDRESS, 18, '', '')
}

export const ORBS: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ORBS', 'Orbs'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x340fE1D898ECCAad394e2ba0fC1F93d27c7b717A', 18, 'ORBS', 'Orbs'),
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 18, 'ORBS', 'Orbs'),
  [ChainId.COSTON]: new Token(ChainId.COSTON, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_MAINNET]: new Token(ChainId.NEAR_MAINNET, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_TESTNET]: new Token(ChainId.NEAR_TESTNET, ZERO_ADDRESS, 18, '', '')
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
  [ChainId.WAGMI]: new Token(ChainId.WAGMI, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin'),
  [ChainId.COSTON]: new Token(ChainId.COSTON, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_MAINNET]: new Token(ChainId.NEAR_MAINNET, ZERO_ADDRESS, 18, '', ''),
  [ChainId.NEAR_TESTNET]: new Token(ChainId.NEAR_TESTNET, ZERO_ADDRESS, 18, '', '')
}

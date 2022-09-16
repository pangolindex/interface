import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'

import { NEAR_MAINNET, Chain, COSTON_TESTNET, SONGBIRD_CANARY, FLARE_MAINNET, ChainId } from '@pangolindex/sdk'

export const activeAirdrops: Chain[] = [COSTON_TESTNET]

export type SpecialAirdropData = { title: string; merkledropContractAddress: string; isActive: boolean }

export const specialAirdrops: { [chainId in ChainId]?: SpecialAirdropData[] } = {
  [ChainId.SONGBIRD]: [
    {
      title: 'Old PSB Reimbursement 1',
      merkledropContractAddress: '0x78407686458ACf7FceA53Cf73697d0ff51052ca6',
      isActive: true
    }
  ]
}

export const commingSoonAirdrops = [NEAR_MAINNET, SONGBIRD_CANARY, FLARE_MAINNET]

export const logoMapping = {
  [ChainId.COSTON]: PNG,
  [ChainId.SONGBIRD]: PSB,
  [ChainId.FUJI]: PNG,
  [ChainId.AVALANCHE]: PNG,
  [ChainId.WAGMI]: PNG,
  14: PNG, // Don't have flare on chain id mapping
  [ChainId.NEAR_MAINNET]: PNR,
  [ChainId.NEAR_TESTNET]: PNR
}

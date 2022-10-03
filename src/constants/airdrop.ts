import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'

import { NEAR_MAINNET, FLARE_MAINNET, ChainId, AirdropType, CHAINS } from '@pangolindex/sdk'

export interface AirdropData {
  address: string
  active: boolean
  type: AirdropType
  title?: string
}

export const activeAirdrops: { [chainId in ChainId]?: AirdropData } = {
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD]!.contracts!.airdrop,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON]!.contracts!.airdrop
}

export const specialAirdrops: { [chainId in ChainId]?: AirdropData[] } = {
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD]!.contracts!.specialAirdrops
}

export const commingSoonAirdrops = [NEAR_MAINNET, FLARE_MAINNET]

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

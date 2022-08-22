import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'

import { NEAR_MAINNET, Chain, COSTON_TESTNET, SONGBIRD_MAINNET, FLARE_MAINNET, ChainId } from '@pangolindex/sdk'

export const activeAirdrops: Chain[] = [COSTON_TESTNET]

export const commingSoonAirdrops = [NEAR_MAINNET, SONGBIRD_MAINNET, FLARE_MAINNET]

export const logoMapping = {
  [ChainId.COSTON]: PNG,
  [ChainId.FUJI]: PNG,
  [ChainId.AVALANCHE]: PNG,
  [ChainId.WAGMI]: PNG,
  14: PNG, // Don't have flare and songbird on chain id mapping
  19: PSB,
  [ChainId.NEAR_MAINNET]: PNR,
  [ChainId.NEAR_TESTNET]: PNR
}

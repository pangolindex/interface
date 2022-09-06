import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'
import PNG_HEDRA from 'src/assets/svg/PNG/PNG_HEDERA.svg'

import { NEAR_MAINNET, Chain, COSTON_TESTNET, SONGBIRD_CANARY, FLARE_MAINNET, ChainId } from '@pangolindex/sdk'

export const activeAirdrops: Chain[] = [COSTON_TESTNET]

export const commingSoonAirdrops = [NEAR_MAINNET, SONGBIRD_CANARY, FLARE_MAINNET]

export const logoMapping = {
  [ChainId.COSTON]: PNG,
  [ChainId.SONGBIRD]: PSB,
  [ChainId.HEDERA_TESTNET]: PNG_HEDRA,
  [ChainId.FUJI]: PNG,
  [ChainId.AVALANCHE]: PNG,
  [ChainId.WAGMI]: PNG,
  14: PNG, // Don't have flare on chain id mapping
  [ChainId.NEAR_MAINNET]: PNR,
  [ChainId.NEAR_TESTNET]: PNR
}

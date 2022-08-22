import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'

import { NEAR_MAINNET, Chain, COSTON_TESTNET, SONGBIRD_MAINNET, FLARE_MAINNET, ChainId } from '@pangolindex/sdk'

export const activeAirdrops: Chain[] = [COSTON_TESTNET]

export const commingSoonAirdrops = [NEAR_MAINNET, SONGBIRD_MAINNET, FLARE_MAINNET]

export const logoMapping = {
  [COSTON_TESTNET.chain_id as ChainId]: PNG,
  [FLARE_MAINNET.chain_id as ChainId]: PNG,
  [SONGBIRD_MAINNET.chain_id as ChainId]: PSB,
  [NEAR_MAINNET.chain_id as ChainId]: PNR
}

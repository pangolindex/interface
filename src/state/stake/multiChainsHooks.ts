import { ChainId } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned } from 'src/state/stake/hooks'

export const useTotalPngEarnedHook = {
  [ChainId.FUJI]: useTotalPngEarned,
  [ChainId.AVALANCHE]: useTotalPngEarned,
  [ChainId.WAGMI]: useTotalPngEarned,
  [ChainId.COSTON]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned
}

import { ChainId, Pair } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned, useDummyStakingInfo, useStakingInfo } from 'src/state/stake/hooks'
import { DoubleSideStakingInfo } from '@pangolindex/components'

export const useTotalPngEarnedHook = {
  [ChainId.FUJI]: useTotalPngEarned,
  [ChainId.AVALANCHE]: useTotalPngEarned,
  [ChainId.WAGMI]: useTotalPngEarned,
  [ChainId.COSTON]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned
}

export const useStakingInfoHook: {
  [chainId in ChainId]: (version: number, pairToFilterBy?: Pair | null) => DoubleSideStakingInfo[]
} = {
  [ChainId.FUJI]: useStakingInfo,
  [ChainId.AVALANCHE]: useStakingInfo,
  [ChainId.WAGMI]: useStakingInfo,
  [ChainId.COSTON]: useStakingInfo,
  [ChainId.NEAR_MAINNET]: useDummyStakingInfo,
  [ChainId.NEAR_TESTNET]: useDummyStakingInfo
}

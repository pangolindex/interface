import { ChainId } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned, useDummyStakingInfo, useStakingInfo } from 'src/state/stake/hooks'

export type UseTotalPngEarnedHookType = {
  [chainId in ChainId]: typeof useTotalPngEarned | typeof useNearTotalPngEarned
}

export const useTotalPngEarnedHook: UseTotalPngEarnedHookType = {
  [ChainId.FUJI]: useTotalPngEarned,
  [ChainId.AVALANCHE]: useTotalPngEarned,
  [ChainId.WAGMI]: useTotalPngEarned,
  [ChainId.COSTON]: useTotalPngEarned,
  [ChainId.SONGBIRD]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned
}

export type UseStakingInfoHookType = {
  [chainId in ChainId]: typeof useStakingInfo | typeof useDummyStakingInfo
}

export const useStakingInfoHook: UseStakingInfoHookType = {
  [ChainId.FUJI]: useStakingInfo,
  [ChainId.AVALANCHE]: useStakingInfo,
  [ChainId.WAGMI]: useStakingInfo,
  [ChainId.COSTON]: useStakingInfo,
  [ChainId.SONGBIRD]: useStakingInfo,
  [ChainId.NEAR_MAINNET]: useDummyStakingInfo,
  [ChainId.NEAR_TESTNET]: useDummyStakingInfo
}

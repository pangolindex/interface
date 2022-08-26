import { ChainId } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned, useDummyStakingInfo, useStakingInfo } from 'src/state/stake/hooks'

export type useTotalPngEarnedHookType = {
  [chainId in ChainId]: typeof useTotalPngEarned | typeof useNearTotalPngEarned
}

export const useTotalPngEarnedHook: useTotalPngEarnedHookType = {
  [ChainId.FUJI]: useTotalPngEarned,
  [ChainId.AVALANCHE]: useTotalPngEarned,
  [ChainId.WAGMI]: useTotalPngEarned,
  [ChainId.COSTON]: useTotalPngEarned,
  [ChainId.SONGBIRD]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned
}

export type useStakingInfoHookType = {
  [chainId in ChainId]: typeof useStakingInfo | typeof useDummyStakingInfo
}

export const useStakingInfoHook: useStakingInfoHookType = {
  [ChainId.FUJI]: useStakingInfo,
  [ChainId.AVALANCHE]: useStakingInfo,
  [ChainId.WAGMI]: useStakingInfo,
  [ChainId.COSTON]: useStakingInfo,
  [ChainId.SONGBIRD]: useStakingInfo,
  [ChainId.NEAR_MAINNET]: useDummyStakingInfo,
  [ChainId.NEAR_TESTNET]: useDummyStakingInfo
}

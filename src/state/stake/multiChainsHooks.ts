import { ChainId } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned, useDummyStakingInfo, useStakingInfo } from 'src/state/stake/hooks'

export function useDummyHook() {
  return undefined
}

export type UseTotalPngEarnedHookType = {
  [chainId in ChainId]: typeof useTotalPngEarned | typeof useNearTotalPngEarned | typeof useDummyHook
}

export const useTotalPngEarnedHook: UseTotalPngEarnedHookType = {
  [ChainId.FUJI]: useTotalPngEarned,
  [ChainId.AVALANCHE]: useTotalPngEarned,
  [ChainId.WAGMI]: useTotalPngEarned,
  [ChainId.COSTON]: useTotalPngEarned,
  [ChainId.SONGBIRD]: useTotalPngEarned,
  [ChainId.HEDERA_TESTNET]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned,
  [ChainId.ETHEREUM]: useDummyHook,
  [ChainId.POLYGON]: useDummyHook,
  [ChainId.FANTOM]: useDummyHook,
  [ChainId.XDAI]: useDummyHook,
  [ChainId.BSC]: useDummyHook,
  [ChainId.ARBITRUM]: useDummyHook,
  [ChainId.CELO]: useDummyHook,
  [ChainId.OKXCHAIN]: useDummyHook,
  [ChainId.VELAS]: useDummyHook,
  [ChainId.AURORA]: useDummyHook,
  [ChainId.CRONOS]: useDummyHook,
  [ChainId.FUSE]: useDummyHook,
  [ChainId.MOONRIVER]: useDummyHook,
  [ChainId.MOONBEAM]: useDummyHook,
  [ChainId.OP]: useDummyHook
}

export type UseStakingInfoHookType = {
  [chainId in ChainId]: typeof useStakingInfo | typeof useDummyStakingInfo | typeof useDummyHook
}

export const useStakingInfoHook: UseStakingInfoHookType = {
  [ChainId.FUJI]: useStakingInfo,
  [ChainId.AVALANCHE]: useStakingInfo,
  [ChainId.WAGMI]: useStakingInfo,
  [ChainId.COSTON]: useStakingInfo,
  [ChainId.SONGBIRD]: useStakingInfo,
  [ChainId.HEDERA_TESTNET]: useDummyStakingInfo,
  [ChainId.NEAR_MAINNET]: useDummyStakingInfo,
  [ChainId.NEAR_TESTNET]: useDummyStakingInfo,
  [ChainId.ETHEREUM]: useDummyHook,
  [ChainId.POLYGON]: useDummyHook,
  [ChainId.FANTOM]: useDummyHook,
  [ChainId.XDAI]: useDummyHook,
  [ChainId.BSC]: useDummyHook,
  [ChainId.ARBITRUM]: useDummyHook,
  [ChainId.CELO]: useDummyHook,
  [ChainId.OKXCHAIN]: useDummyHook,
  [ChainId.VELAS]: useDummyHook,
  [ChainId.AURORA]: useDummyHook,
  [ChainId.CRONOS]: useDummyHook,
  [ChainId.FUSE]: useDummyHook,
  [ChainId.MOONRIVER]: useDummyHook,
  [ChainId.MOONBEAM]: useDummyHook,
  [ChainId.OP]: useDummyHook
}

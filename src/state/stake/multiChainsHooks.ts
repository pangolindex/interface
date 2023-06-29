import { ChainId } from '@pangolindex/sdk'
import { useTotalPngEarned, useNearTotalPngEarned } from 'src/state/stake/hooks'

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
  [ChainId.FLARE_MAINNET]: useTotalPngEarned,
  [ChainId.HEDERA_TESTNET]: useTotalPngEarned,
  [ChainId.HEDERA_MAINNET]: useTotalPngEarned,
  [ChainId.NEAR_MAINNET]: useNearTotalPngEarned,
  [ChainId.NEAR_TESTNET]: useNearTotalPngEarned,
  [ChainId.COSTON2]: useTotalPngEarned,
  [ChainId.EVMOS_TESTNET]: useTotalPngEarned,
  [ChainId.EVMOS_MAINNET]: useDummyHook,
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
  [ChainId.OP]: useDummyHook,
  [ChainId.SKALE_BELLATRIX_TESTNET]: useTotalPngEarned
}

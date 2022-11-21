import { useGelatoLimitOrderList } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'

export type UseGelatoLimitOrdersHookType = {
  [chainId in ChainId]: typeof useGelatoLimitOrderList | typeof useDummyGelatoLimitOrders
}

const useDummyGelatoLimitOrders = () => []

export const useGelatoLimitOrdersHook: UseGelatoLimitOrdersHookType = {
  [ChainId.AVALANCHE]: useGelatoLimitOrderList,
  [ChainId.FUJI]: useGelatoLimitOrderList,
  [ChainId.WAGMI]: useGelatoLimitOrderList,
  [ChainId.COSTON]: useDummyGelatoLimitOrders,
  [ChainId.SONGBIRD]: useDummyGelatoLimitOrders,
  [ChainId.HEDERA_TESTNET]: useDummyGelatoLimitOrders,
  [ChainId.NEAR_MAINNET]: useDummyGelatoLimitOrders,
  [ChainId.NEAR_TESTNET]: useDummyGelatoLimitOrders
}

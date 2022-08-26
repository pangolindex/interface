import { useGelatoLimitOrderList } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'

export type useGelatoLimitOrdersHookType = {
  [chainId in ChainId]: typeof useGelatoLimitOrderList | typeof useDummyGelatoLimitOrders
}

const useDummyGelatoLimitOrders = () => []

export const useGelatoLimitOrdersHook: useGelatoLimitOrdersHookType = {
  [ChainId.AVALANCHE]: useGelatoLimitOrderList,
  [ChainId.FUJI]: useGelatoLimitOrderList,
  [ChainId.WAGMI]: useGelatoLimitOrderList,
  [ChainId.COSTON]: useGelatoLimitOrderList,
  [ChainId.SONGBIRD]: useGelatoLimitOrderList,
  [ChainId.NEAR_MAINNET]: useDummyGelatoLimitOrders,
  [ChainId.NEAR_TESTNET]: useDummyGelatoLimitOrders
}

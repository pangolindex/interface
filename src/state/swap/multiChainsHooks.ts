import { useGelatoLimitOrderList } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'

const useDummyGelatoLimitOrders = () => []

export const useGelatoLimitOrdersHook = {
  [ChainId.AVALANCHE]: useGelatoLimitOrderList,
  [ChainId.FUJI]: useGelatoLimitOrderList,
  [ChainId.WAGMI]: useGelatoLimitOrderList,
  [ChainId.COSTON]: useGelatoLimitOrderList,
  [ChainId.COSTON]: useGelatoLimitOrderList,
  [ChainId.NEAR_MAINNET]: useDummyGelatoLimitOrders,
  [ChainId.NEAR_TESTNET]: useDummyGelatoLimitOrders
}

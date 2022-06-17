import { ChainId } from '@pangolindex/sdk'
import { useTokenBalance, useNearTokenBalance } from 'src/state/wallet/hooks'

export const useTokenBalanceHook = {
  [ChainId.FUJI]: useTokenBalance,
  [ChainId.AVALANCHE]: useTokenBalance,
  [ChainId.WAGMI]: useTokenBalance,
  [ChainId.COSTON]: useTokenBalance,
  [ChainId.NEAR_MAINNET]: useNearTokenBalance,
  [ChainId.NEAR_TESTNET]: useNearTokenBalance
}

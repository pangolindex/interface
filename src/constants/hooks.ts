import { ChainId } from '@pangolindex/sdk'
import { useTokenBalance, useNearTokenBalance } from 'src/state/wallet/hooks'

export const useTokenBalanceHook = {
  [ChainId.FUJI]: useTokenBalance,
  [ChainId.AVALANCHE]: useTokenBalance,
  [ChainId.WAGMI]: useTokenBalance,
  [ChainId.COSTON]: useTokenBalance,
  [329847900]: useNearTokenBalance,
  [329847901]: useNearTokenBalance
}

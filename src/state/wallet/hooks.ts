import { JSBI, TokenAmount } from '@pangolindex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useChainId } from 'src/hooks'
import { useTotalPngEarnedHook } from 'src/state/stake/multiChainsHooks'
import { useTokenBalanceHook, Tokens } from '@pangolindex/components'

// get the total owned and unharvested PNG for account
export function useAggregatePngBalance(): TokenAmount | undefined {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { PNG } = Tokens

  const useTokenBalance_ = useTokenBalanceHook[chainId]
  const useTotalPngEarned = useTotalPngEarnedHook[chainId]

  const png = chainId ? PNG[chainId] : undefined

  const pngBalance: TokenAmount | undefined = useTokenBalance_(account ?? undefined, png)
  const pngUnHarvested: TokenAmount | undefined = useTotalPngEarned()

  if (!png) return undefined

  return new TokenAmount(png, JSBI.add(pngBalance?.raw ?? JSBI.BigInt(0), pngUnHarvested?.raw ?? JSBI.BigInt(0)))
}

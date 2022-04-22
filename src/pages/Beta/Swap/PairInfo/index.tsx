import React from 'react'
import PairStat from './PairStat'
import PairChart from './PairChart'
import { Field } from 'src/state/swap/actions'
import { useDerivedSwapInfo, wrappedCurrency, usePair } from '@pangolindex/components'
import { useChainId } from 'src/hooks'

const PairInfo = () => {
  const chainId = useChainId()

  const { currencies } = useDerivedSwapInfo()

  const token0 = currencies[Field.INPUT]
  const token1 = currencies[Field.OUTPUT]

  const tokenA = wrappedCurrency(token0 ?? undefined, chainId)
  const tokenB = wrappedCurrency(token1 ?? undefined, chainId)

  const [, tokenPair] = usePair(tokenA, tokenB)

  return (
    <>
      <PairStat pair={tokenPair} inputCurrency={token0} outputCurrency={token1} tokenA={tokenA} tokenB={tokenB} />
      <PairChart pair={tokenPair} tokenA={tokenA} tokenB={tokenB} />
    </>
  )
}
export default PairInfo

import React from 'react'
import PairStat from './PairStat'
import PairChart from './PairChart'
import { Field } from 'src/state/swap/actions'
import { useDerivedSwapInfo } from 'src/state/swap/hooks'
import { usePair } from 'src/data/Reserves'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { useActiveWeb3React } from 'src/hooks'

const PairInfo = () => {
  const { chainId } = useActiveWeb3React()

  const { currencies } = useDerivedSwapInfo()

  const token0 = currencies[Field.INPUT]
  const token1 = currencies[Field.OUTPUT]

  const tokenA = wrappedCurrency(token0 ?? undefined, chainId)
  const tokenB = wrappedCurrency(token1 ?? undefined, chainId)

  const [, tokenPair] = usePair(tokenA, tokenB)

  return (
    <>
      <PairStat pair={tokenPair} inputCurrency={token0} outputCurrency={token1} />
      <PairChart pair={tokenPair} tokenB={tokenB} />
    </>
  )
}
export default PairInfo

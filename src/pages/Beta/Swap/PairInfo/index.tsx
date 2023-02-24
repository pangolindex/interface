import React from 'react'
import PairStat from './PairStat'
import PairChart from './PairChart'
import { useDerivedSwapInfo, wrappedCurrency, usePair, Tokens } from '@pangolindex/components'
import { useChainId } from 'src/hooks'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

const PairInfo = () => {
  const chainId = useChainId()

  const { currencies } = useDerivedSwapInfo()

  const token1 = currencies[Field.OUTPUT]

  const tokenB = wrappedCurrency(token1 ?? undefined, chainId)
  const { USDC } = Tokens
  // should show the price of tokenB in USD
  const [, tokenPair] = usePair(USDC[chainId], tokenB)

  return (
    <>
      <PairStat
        pair={tokenPair}
        inputCurrency={token1}
        outputCurrency={USDC[chainId]}
        tokenA={tokenB}
        tokenB={USDC[chainId]}
      />
      <PairChart pair={tokenPair} tokenA={USDC[chainId]} tokenB={tokenB} />
    </>
  )
}
export default PairInfo

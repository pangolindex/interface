import React from 'react'
import PairStat from './PairStat'
import PairChart from './PairChart'
import { Field } from 'src/state/swap/actions'
import { useDerivedSwapInfo, wrappedCurrency, usePair } from '@pangolindex/components'
import { useChainId } from 'src/hooks'
import { USDC } from 'src/constants/tokens'

const PairInfo = () => {
  const chainId = useChainId()

  const { currencies } = useDerivedSwapInfo()

  const token1 = currencies[Field.OUTPUT]

  const tokenB = wrappedCurrency(token1 ?? undefined, chainId)

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

import React, { useState } from 'react'
import { Currency, Pair } from '@pangolindex/sdk'
import { Root } from './styled'
import EarnOption from './EarnOption'
import AddLiquidity from './AddLiquidity'
import Stake from './Stake'

interface EarnWidgetProps {
  currencyA: Currency
  currencyB: Currency
  pair: Pair | null
  version: number
}

const EarnWidget = ({ currencyA, currencyB, pair, version }: EarnWidgetProps) => {
  const [type, setType] = useState('Pool' as string)

  return (
    <Root>
      <EarnOption type={type} setType={setType} />
      {type === 'Pool' ? (
        <AddLiquidity currencyA={currencyA} currencyB={currencyB} type="detail" />
      ) : (
        <Stake pair={pair} version={version} type="detail" />
      )}
    </Root>
  )
}
export default EarnWidget

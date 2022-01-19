import React, { useState } from 'react'
import { Currency } from '@pangolindex/sdk'
import { Root } from './styled'
import EarnOption from './EarnOption'
import AddLiquidity from './AddLiquidity'
import Stake from './Stake'

interface EarnWidgetProps {
  currencyA: Currency
  currencyB: Currency
}

const EarnWidget = ({ currencyA, currencyB }: EarnWidgetProps) => {
  const [type, setType] = useState('EARN' as string)

  return (
    <Root>
      <EarnOption type={type} setType={setType} />
      {type === 'EARN' ? <AddLiquidity currencyA={currencyA} currencyB={currencyB} /> : <Stake />}
    </Root>
  )
}
export default EarnWidget

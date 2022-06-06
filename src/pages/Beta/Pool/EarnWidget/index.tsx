import React, { useState } from 'react'
import { Currency } from '@pangolindex/sdk'
import { Root } from './styled'
import EarnOption from './EarnOption'
import AddLiquidity from './AddLiquidity'
import Stake from './Stake'
import { StakingInfo } from 'src/state/stake/hooks'

interface EarnWidgetProps {
  currencyA: Currency
  currencyB: Currency
  version: number
  stakingInfo: StakingInfo
}

const EarnWidget = ({ currencyA, currencyB, version, stakingInfo }: EarnWidgetProps) => {
  const [type, setType] = useState('Pool' as string)

  return (
    <Root>
      <EarnOption type={type} setType={setType} />
      {type === 'Pool' ? (
        <AddLiquidity currencyA={currencyA} currencyB={currencyB} type="detail" />
      ) : (
        <Stake version={version} type="detail" stakingInfo={stakingInfo} />
      )}
    </Root>
  )
}
export default EarnWidget

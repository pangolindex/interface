import React from 'react'
import { Text } from '@pangolindex/components'
import { Bar, BarRight } from './styleds'
import RewardIcon from 'src/assets/svg/thunder.svg'

export interface TokenAmountProps {
  label: string
  symbol?: string
  amount?: string | number
  cycle?: string
  cycleReward?: string | number
  children?: React.ReactNode
}

export default function TokenAmount({ label, symbol, amount, cycle, cycleReward, children }: TokenAmountProps) {
  return (
    <div>
      <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1" style={{ marginBottom: '5px' }}>
        {label} {symbol}
      </Text>
      <Bar>
        <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
          {amount ? amount : children}
        </Text>
        <BarRight>
          {!cycleReward ? (
            symbol
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {cycleReward && <img src={RewardIcon} alt="reward" style={{ marginRight: '10px' }} />}
              {`${cycleReward} ${symbol} / ${cycle}`}
            </div>
          )}
        </BarRight>
      </Bar>
    </div>
  )
}

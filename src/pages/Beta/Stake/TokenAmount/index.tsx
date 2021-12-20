import React from 'react'
import { Text } from '@pangolindex/components'
import { Bar, BarRight } from './styleds'

export interface TokenAmountProps {
  label: string
  symbol: string
  amount: string | number
  cycle?: string
  cycleReward?: string | number
}

export default function TokenAmount({ label, symbol, amount, cycle, cycleReward }: TokenAmountProps) {
  return (
    <div>
      <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1" style={{ marginBottom: '5px' }}>
        {label}
      </Text>
      <Bar>
        <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
          {amount}
        </Text>
        <BarRight>{!cycleReward ? symbol : `${cycleReward} ${symbol} / ${cycle}`}</BarRight>
      </Bar>
    </div>
  )
}

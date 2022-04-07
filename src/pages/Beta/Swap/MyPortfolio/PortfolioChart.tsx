import React from 'react'
import { Text, Box, Button } from '@antiyro/components'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { BalanceInfo, DurationBtns } from './styleds'
import { useGetChainBalance } from 'src/state/portifolio/hooks'

type Props = {
  /* */
}

const PortfolioChart: React.FC<Props> = () => {
  const data = []
  const durationButtons = ['1H', '1D', '1W', '1M', '1Y', 'ALL']

  const rand = 300
  for (let i = 0; i < 20; i += 1) {
    const d = {
      key: 2000 + i,
      value: Math.random() * (rand + 50) + 100
    }

    data.push(d)
  }

  const { data: balance = 0 } = useGetChainBalance()

  return (
    <Box>
      <BalanceInfo>
        <Text color="text1" fontSize="24px">
          ${balance.toLocaleString()}
        </Text>
        {/* <Text color="green1" fontSize="15px">
          +10.50%
        </Text> */}
        {/* <ToggleButtons options={['AVAX', 'USDT']} value={'USDT'} /> */}
      </BalanceInfo>
      <ResponsiveContainer height={150} width={'100%'}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={'#18C145'} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <DurationBtns>
        {durationButtons.map(btn => (
          <Button variant="plain" key={btn} padding="0px" width="auto" color="text1">
            {btn}
          </Button>
        ))}
      </DurationBtns>
    </Box>
  )
}
export default PortfolioChart

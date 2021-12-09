import React, { useContext } from 'react'
import { Text, Box, CurrencyLogo } from '@pangolindex/components'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { RowWrapper } from './styleds'
import { coinData } from './mock'
import { ThemeContext } from 'styled-components'

type Props = {
  coin: Token
  onClick: () => void
}

const WatchlistRow: React.FC<Props> = ({ coin, onClick }) => {
  const diffPercent = Math.random() < 0.5 ? -1 : 1

  const theme = useContext(ThemeContext)

  return (
    <RowWrapper onClick={onClick}>
      <Box display="flex" alignItems="center">
        <CurrencyLogo size={'28px'} currency={coin} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {coin.symbol}
        </Text>
      </Box>
      <Box px="15px">
        <ResponsiveContainer height={20} width={'100%'}>
          <LineChart data={coinData}>
            <Line type="monotone" dataKey="value" stroke={diffPercent >= 0 ? theme.green1 : theme.red1} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box ml={'10px'} textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          $120
        </Text>
        <Text color={diffPercent > 0 ? 'green1' : 'red1'} fontSize={'8px'} fontWeight={500}>
          +10.5%
        </Text>
      </Box>
    </RowWrapper>
  )
}

export default WatchlistRow

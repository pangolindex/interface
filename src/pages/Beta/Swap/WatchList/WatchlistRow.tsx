import React, { useContext } from 'react'
import { Text, Box, CurrencyLogo } from '@pangolindex/components'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { RowWrapper } from './styleds'
import { ThemeContext } from 'styled-components'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useTokenChartData } from 'src/state/token/hooks'

type Props = {
  coin: Token
  onClick: () => void
}

const WatchlistRow: React.FC<Props> = ({ coin, onClick }) => {
  const theme = useContext(ThemeContext)
  const usdcPrice = useUSDCPrice(coin)

  let chartData = useTokenChartData(coin?.address?.toLowerCase())

  let currentUSDPrice = chartData?.[(chartData || []).length - 1]?.priceUSD || 0
  let previousUSDPrice = chartData?.[0]?.priceUSD || 0
  const diffPercent = currentUSDPrice - previousUSDPrice < 0 ? -1 : 1
  var decreaseValue = currentUSDPrice - previousUSDPrice
  let perc = (decreaseValue / previousUSDPrice) * 100

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
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="priceUSD"
              stroke={diffPercent >= 0 ? theme.green1 : theme.red1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box ml={'10px'} textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          ${usdcPrice ? usdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}
        </Text>
        <Text color={diffPercent > 0 ? 'green1' : 'red1'} fontSize={'8px'} fontWeight={500}>
          {perc.toFixed(3)}%
        </Text>
      </Box>
    </RowWrapper>
  )
}

export default WatchlistRow

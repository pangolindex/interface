import React, { useContext, useEffect, useState } from 'react'
import { Text, Box, CurrencyLogo } from '@pangolindex/components'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { RowWrapper } from './styleds'
import { ThemeContext } from 'styled-components'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useTokenWeeklyChartData } from 'src/state/token/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'

type Props = {
  coin: Token
  onClick: () => void
  isSelected: boolean
}

const WatchlistRow: React.FC<Props> = ({ coin, onClick, isSelected }) => {
  const [showChart, setShowChart] = useState(false)
  const theme = useContext(ThemeContext)
  const usdcPrice = useUSDCPrice(coin)

  let chartData = useTokenWeeklyChartData(coin?.address?.toLowerCase())

  let currentUSDPrice = chartData?.[(chartData || []).length - 1]?.priceUSD || 0
  let previousUSDPrice = chartData?.[0]?.priceUSD || 0
  const diffPercent = currentUSDPrice - previousUSDPrice < 0 ? -1 : 1
  var decreaseValue = currentUSDPrice - previousUSDPrice
  let perc = (decreaseValue / previousUSDPrice) * 100

  const token = unwrappedToken(coin)

  useEffect(() => {
    if (usdcPrice) {
      setTimeout(() => {
        // show chart only after price of token comes to display chart in visible space
        setShowChart(true)
      })
    }
  }, [usdcPrice, setShowChart])

  return (
    <RowWrapper onClick={onClick} isSelected={isSelected}>
      <Box display="flex" alignItems="center">
        <CurrencyLogo size={'28px'} currency={token} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {token.symbol}
        </Text>
      </Box>
      <Box px="7px">
        {/* show chart only after price of token comes to display chart in visible space */}
        {showChart && (
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
        )}
      </Box>
      <Box textAlign="right">
        <Text color="text1" fontSize={14} fontWeight={500}>
          {usdcPrice ? `$${usdcPrice?.toSignificant(4, { groupSeparator: ',' })}` : '-'}
        </Text>
        {!isNaN(perc) && (
          <Text color={diffPercent > 0 ? 'green1' : 'red1'} fontSize={'8px'} fontWeight={500}>
            {perc.toFixed(3)}%
          </Text>
        )}
      </Box>
    </RowWrapper>
  )
}

export default WatchlistRow

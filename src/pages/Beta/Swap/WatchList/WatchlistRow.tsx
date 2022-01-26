import React, { useContext, useEffect, useState } from 'react'
import { Text, Box, CurrencyLogo } from '@pangolindex/components'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { DeleteButton, RowWrapper } from './styleds'
import { ThemeContext } from 'styled-components'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useTokenWeeklyChartData } from 'src/state/token/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { X } from 'react-feather'
import { removeCurrency } from 'src/state/watchlists/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/state'

type Props = {
  coin: Token
  onClick: () => void
  onRemove: () => void
  isSelected: boolean
}

const WatchlistRow: React.FC<Props> = ({ coin, onClick, onRemove, isSelected }) => {
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

  const dispatch = useDispatch<AppDispatch>()

  const removeToken = () => {
    onRemove()
    dispatch(removeCurrency(coin?.address))
  }

  useEffect(() => {
    if (usdcPrice) {
      setTimeout(() => {
        // show chart only after price of token comes to display chart in visible space
        setShowChart(true)
      })
    }
  }, [usdcPrice, setShowChart])

  return (
    <RowWrapper isSelected={isSelected}>
      <Box display="flex" alignItems="center" height={"100%"} onClick={onClick}>
        <CurrencyLogo size={'28px'} currency={token} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {token.symbol}
        </Text>
      </Box>
      <Box px="7px" onClick={onClick} >
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
      <Box textAlign="right" onClick={onClick}>
        <Text color="text1" fontSize={14} fontWeight={500}>
          {usdcPrice ? `$${usdcPrice?.toSignificant(4, { groupSeparator: ',' })}` : '-'}
        </Text>
        {!isNaN(perc) && (
          <Text color={diffPercent > 0 ? 'green1' : 'red1'} fontSize={'8px'} fontWeight={500}>
            {perc.toFixed(3)}%
          </Text>
        )}
      </Box>
      <Box height={"100%"} onClick={removeToken}>
        <DeleteButton>
          <X fontSize={16} fontWeight={600} />
        </DeleteButton>
      </Box>
    </RowWrapper >
  )
}

export default WatchlistRow

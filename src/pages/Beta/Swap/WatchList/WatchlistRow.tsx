import React, { useContext, useEffect, useState } from 'react'
import { Text, Box, CurrencyLogo } from '@antiyro/components'
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
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'

type Props = {
  coin: Token
  onClick: () => void
  onRemove: () => void
  isSelected: boolean
}

const WatchlistRow: React.FC<Props> = ({ coin, onClick, onRemove, isSelected }) => {
  // const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const chainId = useChainId()
  const [showChart, setShowChart] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const theme = useContext(ThemeContext)
  const usdcPrice = useUSDCPrice(coin)

  const chartData = useTokenWeeklyChartData(coin?.address?.toLowerCase())

  const currentUSDPrice = chartData?.[(chartData || []).length - 1]?.priceUSD || 0
  const previousUSDPrice = chartData?.[0]?.priceUSD || 0
  const diffPercent = currentUSDPrice - previousUSDPrice < 0 ? -1 : 1
  const decreaseValue = currentUSDPrice - previousUSDPrice
  const perc = (decreaseValue / previousUSDPrice) * 100

  const token = unwrappedToken(coin, chainId)

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
    <RowWrapper
      isSelected={isSelected}
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <Box display="flex" alignItems="center" height={'100%'} onClick={onClick}>
        <CurrencyLogo size={24} currency={token} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {token.symbol}
        </Text>
      </Box>
      <Box px="7px" display="flex" alignItems="center" height={'100%'} onClick={onClick}>
        {/* show chart only after price of token comes to display chart in visible space */}
        {/* rechart has responsive container in mobile view when add 3rd row its gradually increase width so if we set width 99% then its resolved */}
        {/* ref: https://github.com/recharts/recharts/issues/172#issuecomment-307858843 */}
        {showChart && (
          <ResponsiveContainer height={20} width={'99%'}>
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
      <Box textAlign="right" minWidth={30} height={'100%'}>
        {showDeleteButton && coin.address !== PNG[chainId].address && (
          <Box zIndex={2} position="relative">
            <DeleteButton onClick={removeToken}>
              <X fontSize={16} fontWeight={600} style={{ float: 'right' }} />
            </DeleteButton>
          </Box>
        )}
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%" onClick={onClick}>
          <Text color="text1" fontSize={14} fontWeight={500}>
            {usdcPrice ? `$${usdcPrice?.toSignificant(4, { groupSeparator: ',' })}` : '-'}
          </Text>
          {!isNaN(perc) && (
            <Text color={diffPercent > 0 ? 'green1' : 'red1'} fontSize={'8px'} fontWeight={500}>
              {perc.toFixed(3)}%
            </Text>
          )}
        </Box>
      </Box>
    </RowWrapper>
  )
}

export default WatchlistRow

import React, { useCallback, useContext, useState } from 'react'
import { Text, Box, CurrencyLogo, Button } from '@pangolindex/components'
import { Link } from 'react-feather'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { SelectedCoinInfo, TrackIcons, DurationBtns } from './styleds'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { ANALYTICS_PAGE } from 'src/constants'
import { useSwapActionHandlers } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'
import { useTokenPriceData } from 'src/state/token/hooks'
import { TIMEFRAME } from 'src/constants'
import { formattedNum, toNiceDateYear } from 'src/utils/charts'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from 'src/utils/wrappedCurrency'

type Props = {
  coin: Token
}

export const RedirectContext = React.createContext<boolean>(false)

const CoinChart: React.FC<Props> = ({ coin }) => {
  const { t } = useTranslation()
  let weekFrame = TIMEFRAME.find(t => t.label === '1W')

  const [timeWindow, setTimeWindow] = useState(
    weekFrame ||
      ({} as {
        description: string
        label: string
        interval: number
        momentIdentifier: string
      })
  )

  const redirect = useContext(RedirectContext)

  const usdcPrice = useUSDCPrice(coin)

  const { onCurrencySelection } = useSwapActionHandlers()
  const onCurrencySelect = useCallback(
    currency => {
      onCurrencySelection(Field.INPUT, currency)
    },
    [onCurrencySelection]
  )

  const priceData =
    useTokenPriceData(
      coin?.address.toLowerCase(),
      timeWindow?.momentIdentifier,
      timeWindow?.interval,
      timeWindow?.label
    ) || []

  const token = unwrappedToken(coin)

  let priceChart = [...priceData]
  // add current price in chart
  if (priceChart.length > 0 && usdcPrice) {
    const timestampnow = Math.floor(Date.now() / 1000)
    
    priceChart.push({
      priceUSD: parseFloat(usdcPrice?.toSignificant(4)),
      timestamp: `${timestampnow}`
    }) 
  }

  return (
    <Box>
      <SelectedCoinInfo>
        <CurrencyLogo currency={token} size="56px" />
        <Box>
          <Text color="text1" fontSize="24px">
            {token.symbol}
          </Text>
          <Text color="green1" fontSize="16px">
            ${usdcPrice ? usdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}
          </Text>
        </Box>
        <TrackIcons>
          <Button
            variant="primary"
            backgroundColor="primary"
            color="black"
            width={'32px'}
            height={'32px'}
            padding="0px"
            href={`${ANALYTICS_PAGE}#/token/${coin.address}`}
            target="_blank"
            as="a"
          >
            <Link size={12} />
          </Button>
          {redirect ? (
            <Button
              variant="plain"
              backgroundColor="oceanBlue"
              color="white"
              padding="0px 10px"
              height="32px"
              href={`/#/beta/swap?inputCurrency=${coin.address}`}
              target=""
              as="a"
            >
              {t('swapPage.trade')}
            </Button>
          ) : (
            <Button
              variant="plain"
              backgroundColor="oceanBlue"
              color="white"
              padding="0px 10px"
              height="32px"
              onClick={() => {
                onCurrencySelect(coin)
              }}
            >
              {t('swapPage.trade')}
            </Button>
          )}
        </TrackIcons>
      </SelectedCoinInfo>
      <ResponsiveContainer height={150} width={'100%'}>
        <LineChart data={priceChart}>
          <Line type="monotone" dataKey="priceUSD" stroke={'#18C145'} dot={false} />
          <Tooltip
            cursor={true}
            formatter={(priceUSD: number, name: any, props: any) => {
              return [`${formattedNum(priceUSD, true)}`, 'USD']
            }}
            labelFormatter={(val, data) => {
              return toNiceDateYear(data?.[0]?.payload?.timestamp)
            }}
            labelStyle={{ paddingTop: 4 }}
            wrapperStyle={{ top: -70, left: -10, zIndex: 9999 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <DurationBtns>
        {TIMEFRAME.map(btn => (
          <Button
            variant="plain"
            key={btn?.label}
            padding="0px"
            width="auto"
            color={timeWindow.label === btn.label ? 'mustardYellow' : 'text1'}
            onClick={() => setTimeWindow(btn)}
          >
            {btn?.label}
          </Button>
        ))}
      </DurationBtns>
    </Box>
  )
}
export default CoinChart

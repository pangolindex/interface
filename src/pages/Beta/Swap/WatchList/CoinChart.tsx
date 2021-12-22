import React, { useCallback } from 'react'
import { Text, Box, CurrencyLogo, Button } from '@pangolindex/components'
import { Link } from 'react-feather'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Token } from '@pangolindex/sdk'
import { SelectedCoinInfo, TrackIcons, DurationBtns } from './styleds'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { ExternalLink } from 'src/theme'
import { ANALYTICS_PAGE } from 'src/constants'
import { useSwapActionHandlers } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'

type Props = {
  coin: Token
}

const CoinChart: React.FC<Props> = ({ coin }) => {
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

  const usdcPrice = useUSDCPrice(coin)

  const { onCurrencySelection } = useSwapActionHandlers()
  const onCurrencySelect = useCallback(
    currency => {
      onCurrencySelection(Field.INPUT, currency)
    },
    [onCurrencySelection]
  )

  return (
    <Box>
      <SelectedCoinInfo>
        <CurrencyLogo currency={coin} size="56px" />
        <Box>
          <Text color="text1" fontSize="24px">
            {coin.symbol}
          </Text>
          <Text color="green1" fontSize="16px">
            ${usdcPrice ? usdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}
          </Text>
        </Box>
        <TrackIcons>
          <ExternalLink href={`${ANALYTICS_PAGE}#/token/${coin.address}`}>
            <Button
              variant="primary"
              backgroundColor="text8"
              color="text1"
              width={'32px'}
              height={'32px'}
              padding="0px"
            >
              <Link size={12} />
            </Button>
          </ExternalLink>
          <Button
            variant="plain"
            backgroundColor="green1"
            color="text1"
            padding="5px 10px"
            onClick={() => {
              onCurrencySelect(coin)
            }}
          >
            Trade
          </Button>
        </TrackIcons>
      </SelectedCoinInfo>
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
export default CoinChart

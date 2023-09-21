import React, { useContext } from 'react'
import { PanelWrapper, MobileStat } from './styleds'
import { Text, Box, Stat, DoubleCurrencyLogo } from '@honeycomb-finance/core'
import { useTranslation } from '@honeycomb-finance/shared'
import { useUSDCPrice } from '@honeycomb-finance/state-hooks'
import { ThemeContext } from 'styled-components'
import { Pair, Currency, Token } from '@pangolindex/sdk'
import { useAllPairChartData, useAllPairTokensChartData } from 'src/state/pair/hooks'

type Props = { pair?: Pair | null; inputCurrency?: Currency; outputCurrency?: Currency; tokenB?: Token; tokenA?: Token }

const PairStat: React.FC<Props> = ({ pair, inputCurrency, outputCurrency, tokenA, tokenB }) => {
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)

  const inputUsdcPrice = useUSDCPrice(inputCurrency) // from
  const outputUsdcPrice = useUSDCPrice(outputCurrency) // to

  const Pair0UsdcPrice =
    inputUsdcPrice && outputUsdcPrice ? Number(inputUsdcPrice.toFixed()) / Number(outputUsdcPrice.toFixed()) : 0

  const Pair1UsdcPrice =
    inputUsdcPrice && outputUsdcPrice ? Number(outputUsdcPrice.toFixed()) / Number(inputUsdcPrice.toFixed()) : 0
  const allPairChart = useAllPairChartData()

  const pairChart = allPairChart?.[(pair?.liquidityToken?.address || '').toLowerCase()] || []
  const tokensPairAddress = `${tokenA?.address?.toLowerCase()}_${tokenB?.address?.toLowerCase()}`

  const allPairTokensChart = useAllPairTokensChartData()

  const tokensPairChart = allPairTokensChart?.[(tokensPairAddress || '').toLowerCase()] || []

  const currentPair0UsdcPrice =
    (pairChart[0] || []).length > 0
      ? pairChart?.[0]?.[(pairChart[0] || []).length - 1]?.open || 0
      : tokensPairChart?.[0]?.[(tokensPairChart[0] || []).length - 1]?.open || 0
  const lastDaypair0UsdcPrice =
    (pairChart[0] || []).length > 0
      ? pairChart?.[0]?.[(pairChart[0] || []).length - 2]?.open || 0
      : tokensPairChart?.[0]?.[(tokensPairChart[0] || []).length - 2]?.open || 0

  const decreaseValue = currentPair0UsdcPrice - lastDaypair0UsdcPrice
  const perc = decreaseValue && lastDaypair0UsdcPrice ? (decreaseValue / lastDaypair0UsdcPrice) * 100 : 0

  return (
    <Box>
      <MobileStat>
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={24} currency0={inputCurrency} currency1={outputCurrency} />
          <Text color="text1" fontSize={16} fontWeight={500} lineHeight="55px" marginLeft={10}>
            {inputCurrency?.symbol}/{outputCurrency?.symbol}
          </Text>
        </Box>

        <Stat stat={`${Pair0UsdcPrice ? Pair0UsdcPrice?.toFixed(4) : '-'}`} statFontSize={16} />
      </MobileStat>

      <PanelWrapper>
        <Box
          borderRight={`1px solid ${theme.text2}`}
          padding={'10px 10px'}
          display="flex"
          alignItems="center"
          height="100%"
          minWidth={270}
        >
          <DoubleCurrencyLogo size={24} currency0={inputCurrency} currency1={outputCurrency} />
          <Text color="text1" fontSize={16} fontWeight={500} lineHeight="55px" marginLeft={10}>
            {inputCurrency?.symbol}/{outputCurrency?.symbol}
          </Text>
        </Box>
        <Box padding="10px 6px">
          <Stat
            title={`${inputCurrency?.symbol} ${t('swap.price')}`}
            stat={`$${inputUsdcPrice ? inputUsdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
            titleColor="text2"
          />
        </Box>

        <Box padding="10px 6px">
          <Stat
            title={`${outputCurrency?.symbol} ${t('swap.price')}`}
            stat={`$${outputUsdcPrice ? outputUsdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
            titleColor="text2"
          />
        </Box>

        <Box padding="10px 6px">
          <Stat
            title={`${inputCurrency?.symbol}/${outputCurrency?.symbol}`}
            stat={`${Pair0UsdcPrice ? Pair0UsdcPrice?.toFixed(4) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
            titleColor="text2"
          />
        </Box>

        <Box padding="10px 6px">
          <Stat
            title={`${outputCurrency?.symbol}/${inputCurrency?.symbol}`}
            stat={`${Pair1UsdcPrice ? Pair1UsdcPrice?.toFixed(4) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
            titleColor="text2"
          />
        </Box>

        <Box padding="10px 6px">
          <Stat
            title={`24H ${t('accountDetails.change')}`}
            stat={perc ? `${perc.toFixed(3)}%` : '-'}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
            titleColor="text2"
          />
        </Box>
      </PanelWrapper>
    </Box>
  )
}
export default PairStat

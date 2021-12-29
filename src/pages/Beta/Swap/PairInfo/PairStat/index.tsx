import React, { useContext } from 'react'
import { PanelWrapper } from './styleds'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import Stat from 'src/components/Stat'
import { ThemeContext } from 'styled-components'
import { Pair, Currency } from '@pangolindex/sdk'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useAllTokenPairChartData } from 'src/state/pair/hooks'
import { useTranslation } from 'react-i18next'

type Props = { pair?: Pair | null; inputCurrency?: Currency; outputCurrency?: Currency }

const PairStat: React.FC<Props> = ({ pair, inputCurrency, outputCurrency }) => {
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)

  const inputUsdcPrice = useUSDCPrice(inputCurrency)
  const outputUsdcPrice = useUSDCPrice(outputCurrency)

  const allTokenChart = useAllTokenPairChartData()

  const pairChart = allTokenChart?.[(pair?.liquidityToken?.address || '').toLowerCase()] || []

  const currentPair0UsdcPrice = pairChart?.[0]?.[(pairChart[0] || []).length - 1]?.value || 0
  const currentPair1UsdcPrice = pairChart?.[1]?.[(pairChart[1] || []).length - 1]?.value || 0

  const lastDaypair0UsdcPrice = pairChart?.[0]?.[(pairChart[0] || []).length - 2]?.value || 0

  var decreaseValue = currentPair0UsdcPrice - lastDaypair0UsdcPrice
  let perc = (decreaseValue / lastDaypair0UsdcPrice) * 100

  return (
    <PanelWrapper>
      <Box
        borderRight={`1px solid ${theme.text2}`}
        padding={'10px 10px'}
        display="flex"
        alignItems="center"
        height="100%"
        minWidth={250}
      >
        <DoubleCurrencyLogo size={24} currency0={inputCurrency} currency1={outputCurrency} />
        <Text color="text1" fontSize={24} fontWeight={500} lineHeight="55px" marginLeft={10}>
          {inputCurrency?.symbol}/ {outputCurrency?.symbol}
        </Text>
      </Box>
      <Box padding="10px 6px">
        <Stat
          title={`${inputCurrency?.symbol} ${t('swap.price')}`}
          stat={`$${inputUsdcPrice ? inputUsdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding="10px 6px">
        <Stat
          title={`${outputCurrency?.symbol} ${t('swap.price')}`}
          stat={`$${outputUsdcPrice ? outputUsdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding="10px 6px">
        <Stat
          title={`${inputCurrency?.symbol}/${outputCurrency?.symbol}`}
          stat={
            pair?.token0 === outputCurrency
              ? `${currentPair0UsdcPrice ? currentPair0UsdcPrice?.toFixed(4) : '-'}`
              : `${currentPair1UsdcPrice ? currentPair1UsdcPrice?.toFixed(4) : '-'}`
          }
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding="10px 6px">
        <Stat
          title={`${outputCurrency?.symbol}/${inputCurrency?.symbol}`}
          stat={
            pair?.token0 === outputCurrency
              ? `${currentPair1UsdcPrice ? currentPair1UsdcPrice?.toFixed(4) : '-'}`
              : `${currentPair0UsdcPrice ? currentPair0UsdcPrice?.toFixed(4) : '-'}`
          }
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding="10px 6px">
        <Stat
          title={`24H ${t('accountDetails.change')}`}
          stat={perc ? `${perc.toFixed(3)}%` : '-'}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>
    </PanelWrapper>
  )
}
export default PairStat

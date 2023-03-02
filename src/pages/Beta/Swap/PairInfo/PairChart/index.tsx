import React, { useState, useEffect } from 'react'
import { Pair, Token, CHAINS, WAVAX } from '@pangolindex/sdk'
import { createChart, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useMeasure } from 'react-use'
import { useDarkModeManager } from 'src/state/user/hooks'
import { usePairHourlyRateData, useHourlyPairTokensChartData, useCoingeckoChartData } from 'src/state/pair/hooks'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/svg/blue-loader.svg'
import { Box, Text, TIMEFRAME, useTranslation } from '@pangolindex/components'
import { ChartWrapper, ChartContainer } from './styleds'
import { useChainId } from 'src/hooks'

type Props = { pair?: Pair | null; tokenB?: Token; tokenA?: Token }

const PairChart: React.FC<Props> = ({ pair, tokenA, tokenB }) => {
  const chainId = useChainId()
  const { t } = useTranslation()
  const [ref, { width, height }] = useMeasure()

  const [chartCreated, setChartCreated] = useState<IChartApi>()
  const [chartSeries, setChartSeries] = useState<ISeriesApi<'Candlestick'>>()
  const [isDark] = useDarkModeManager()

  const timeWindow =
    TIMEFRAME.find(t => t.label === '1Y') ||
    ({} as {
      description: string
      label: string
      interval: number
      momentIdentifier: string
    })

  // get pair chart data directly from contract
  // [tokenB/tokenA, tokenA/tokenB]
  const pairChartData = usePairHourlyRateData(
    (pair?.liquidityToken?.address || '').toLowerCase(),
    timeWindow?.momentIdentifier,
    86400
  )
  const chartData = pairChartData && pair?.token1 === tokenB ? pairChartData[0] : pairChartData ? pairChartData[1] : []

  // get tokens data directly from contract incase pair doesn't exist
  // [tokenB/tokenA, tokenA/tokenB]
  const pairTokensChartData = useHourlyPairTokensChartData(
    tokenA?.address || '',
    tokenB?.address || '',
    timeWindow?.momentIdentifier,
    86400
  )

  const chartData1 =
    pairTokensChartData && pair?.token1 === tokenB
      ? pairTokensChartData[0]
      : pairTokensChartData
      ? pairTokensChartData[1]
      : []

  // usd price of tokenB via coingecko
  const coingeckoData = useCoingeckoChartData(tokenB || WAVAX[chainId])
  const chartData2 =
    !coingeckoData || coingeckoData.length === 0 ? [] : pair?.token1 === tokenB ? coingeckoData[0] : coingeckoData[1]

  // priority wise => coingecko data -> pair data -> individual token data
  const formattedData = chartData2.length > 0 ? chartData2 : (chartData1 || []).length > 0 ? chartData1 : chartData

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    let chart
    if (!chartCreated) {
      const htmlElement = document.getElementById('chart-container-id')!
      chart = createChart(htmlElement, {
        layout: {
          backgroundColor: 'transparent',
          textColor: '#fff',
          fontSize: 12,
          fontFamily: "'Poppins',sans-serif"
        },
        leftPriceScale: {
          visible: true
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false
        },
        timeScale: {
          borderVisible: true
          // timeVisible: true,
          // secondsVisible: false
        },
        grid: {
          horzLines: {
            color: '#707070',
            visible: true,
            style: 2
          },
          vertLines: {
            color: '#707070',
            visible: true,
            style: 2
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          horzLine: {
            visible: true,
            labelVisible: true
          },
          vertLine: {
            visible: true,
            style: 1,
            width: 2,
            color: 'rgba(32, 38, 46, 0.5)',
            labelVisible: true
          }
        },
        localization: {
          dateFormat: 'yyyy-MM-dd'
        }
      })

      const series = chart.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1'
      })

      series?.setData([...(formattedData || [])])
      setChartSeries(series)

      const toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      if (htmlElement) htmlElement.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.fontWeight = '400'
      toolTip.style.left = -4 + 'px'
      toolTip.style.top = '-' + 8 + 'px'
      toolTip.style.backgroundColor = 'transparent'

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [chartCreated, formattedData])

  useEffect(() => {
    if (chartCreated && formattedData) {
      chartSeries?.setData([...(formattedData || [])])
    }
  }, [formattedData, chartCreated, chartSeries])

  useEffect(() => {
    if (chartCreated) {
      chartCreated.applyOptions({
        layout: {
          textColor: isDark ? '#707070' : 'black'
        }
      })
    }
  }, [isDark, chartCreated])

  useEffect(() => {
    chartCreated?.applyOptions({
      width,
      height
    })
  }, [width, height, chartCreated])

  return (
    <ChartWrapper>
      {!CHAINS[chainId]?.tracked_by_debank ? (
        <ChartContainer id="chart-container-id" ref={ref as any}>
          {(formattedData || []).length === 0 && (
            <Box
              position={'absolute'}
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="text1" fontSize="24px">
                {t('votePage.notSupported')}
              </Text>
            </Box>
          )}
        </ChartContainer>
      ) : (
        <ChartContainer id="chart-container-id" ref={ref as any}>
          {(formattedData || []).length === 0 && (
            <Box
              position={'absolute'}
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CustomLightSpinner src={Circle} alt="loader" size={'50px'} />
            </Box>
          )}
        </ChartContainer>
      )}
    </ChartWrapper>
  )
}

export default PairChart

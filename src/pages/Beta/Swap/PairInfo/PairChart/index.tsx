import React, { useState, useEffect } from 'react'
import { Pair, Token } from '@pangolindex/sdk'
import { createChart, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useMeasure } from 'react-use'
import { useDarkModeManager } from 'src/state/user/hooks'
import { ChartWrapper } from './styleds'
import { TIMEFRAME } from 'src/constants'
import { useHourlyRateData } from 'src/state/pair/hooks'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { Box } from '@pangolindex/components'

type Props = { pair?: Pair | null; tokenB?: Token }

const PairChart: React.FC<Props> = ({ pair, tokenB }) => {
  const [ref, { width, height }] = useMeasure()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi>()
  const [chartSeries, setChartSeries] = useState<ISeriesApi<'Area'>>()
  const [isDark] = useDarkModeManager()

  let timeWindow =
    TIMEFRAME.find(t => t.label === '1Y') ||
    ({} as {
      description: string
      label: string
      interval: number
      momentIdentifier: string
    })

  const pairChartData = useHourlyRateData(
    (pair?.liquidityToken?.address || '').toLowerCase(),
    timeWindow?.momentIdentifier,
    86400
  )
  const chartData = pairChartData && pair?.token0 === tokenB ? pairChartData[0] : pairChartData ? pairChartData[1] : []

  const formattedData = chartData

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

      let series = chart.addAreaSeries({
        topColor: '#E67826',
        bottomColor: 'transparent',
        lineColor: '#E67826',
        lineWidth: 1,
        crosshairMarkerVisible: true,
        lastValueVisible: false,
        priceLineVisible: false
      })

      series.setData([...formattedData])
      setChartSeries(series)

      let toolTip = document.createElement('div')
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
      chartSeries?.setData([...formattedData])
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
      {/* {(formattedData || []).length > 0 ? ( */}
      <div id={'chart-container-id'} ref={ref as any} style={{ height: '100%' }}>
        {(formattedData || []).length === 0 && (
          <Box position={'fixed'} top="40%" left="40%" width={50} height={50}>
            <CustomLightSpinner src={Circle} alt="loader" size={'50px'} />
          </Box>
        )}
      </div>
      {/* ) : (
        <Box mb={'15px'}>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </Box>
      )} */}
    </ChartWrapper>
  )
}

export default PairChart

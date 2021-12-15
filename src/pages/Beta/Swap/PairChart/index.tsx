import React, { useState, useEffect } from 'react'
import { createChart, CrosshairMode, IChartApi } from 'lightweight-charts'
import { useMeasure } from 'react-use'
import { useDarkModeManager } from 'src/state/user/hooks'
import { ChartWrapper } from './styleds'

const data = [
  { time: '2021-11-07', value: 1000 },
  { time: '2021-11-08', value: 2000 },
  { time: '2021-11-09', value: 3000 },
  { time: '2021-11-10', value: 2000 },
  { time: '2021-11-11', value: 3000 },
  { time: '2021-11-12', value: 1000 },
  { time: '2021-11-13', value: 2000 },
  { time: '2021-11-14', value: 3000 },
  { time: '2021-11-15', value: 1000 },
  { time: '2021-11-16', value: 4000 }
]

export default function PairChart() {
  const [ref, { width, height }] = useMeasure()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi>()
  const [isDark] = useDarkModeManager()

  const formattedData = data

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

      series.setData(formattedData)
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
  }, [width, height])

  return (
    <ChartWrapper>
      <div id={'chart-container-id'} ref={ref as any} style={{ height: '100%' }} />
    </ChartWrapper>
  )
}

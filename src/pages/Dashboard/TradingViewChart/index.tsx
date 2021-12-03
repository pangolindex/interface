import React, { useState, useEffect } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'
import styled from 'styled-components'
import { useDarkModeManager } from '../../../state/user/hooks'

const WIDTH = 740
const HEIGHT = 415
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

const Wrapper = styled.div`
  position: relative;
  margin-top: 48px;
`

export default function TradingViewChart() {
  // reference for DOM element to create with chart
  // const ref = useRef()

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
        width: WIDTH,
        height: HEIGHT,
        layout: {
          backgroundColor: 'transparent',
          textColor: '#707070',
          fontSize: 24
        },
        leftPriceScale: {
          scaleMargins: {
            top: 0.32,
            bottom: 0.2
          },
          visible: true,
          borderVisible: false
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false
        },
        timeScale: {
          borderVisible: false
        },
        grid: {
          horzLines: {
            color: '#707070',
            visible: true,
            style: 3
          },
          vertLines: {
            color: '#707070',
            visible: false
          }
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false
          }
        }
      })

      let series = chart.addAreaSeries({
        topColor: 'transparent',
        bottomColor: 'transparent',
        lineColor: '#E67826',
        lineWidth: 3,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false
      })

      series.setData(formattedData)
      let toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      if (htmlElement) htmlElement.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.fontWeight = '500'
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
  return (
    <Wrapper>
      <div id={'chart-container-id'} />
    </Wrapper>
  )
}

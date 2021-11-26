import React, { useState, useEffect } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'
import styled from 'styled-components'

const WIDTH = 700
const HEIGHT = 400
const data = [
  { time: '2021-11-07', value: 6.59 },
  { time: '2021-11-08', value: 11.59 },
  { time: '2021-11-09', value: 8.59 },
  { time: '2021-11-10', value: 10.59 },
  { time: '2021-11-11', value: 12.59 }
]

const Wrapper = styled.div`
  position: relative;
`

export default function TradingViewChart() {
  // reference for DOM element to create with chart
  // const ref = useRef()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi>()
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
          textColor: 'white'
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.32,
            bottom: 0
          },
          borderVisible: false
        },
        timeScale: {
          borderVisible: false
        },
        grid: {
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          },
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
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
        topColor: '#FF6B00',
        bottomColor: 'rgba(232, 65, 66, 0)',
        lineColor: '#FF6B00',
        lineWidth: 3
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
  return (
    <Wrapper>
      <div id={'chart-container-id'} />
    </Wrapper>
  )
}

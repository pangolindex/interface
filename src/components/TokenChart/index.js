import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import 'feather-icons'
import { Maximize, Minimize } from 'react-feather'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { OptionButton } from '../ButtonStyled'
import { darken } from 'polished'
import { useMedia, usePrevious } from 'react-use'
import { timeframeOptions } from '../../constants'
import { useTokenChartData } from '../../contexts/TokenData'
import DropdownSelect from '../DropdownSelect'
import LocalLoader from '../LocalLoader'
import { AutoColumn } from '../Column'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import AdvanceChart from '../AdvanceChart'
import datafeed from './datafeed.js'

const ChartWrapper = styled.div`
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const MaximizeIcon = styled(Maximize)`
  min-height: 14px;
  min-width: 14px;
`

const MinimizeIcon = styled(Minimize)`
  min-height: 14px;
  min-width: 14px;
`

const fullScreenStyle = {
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  background: '#000',
  zIndex: 9999999,
}

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  PRICE: 'Price',
}

const DATA_FREQUENCY = {
  DAY: 'DAY',
  HOUR: 'HOUR',
  LINE: 'LINE',
}

const TokenChart = ({ address, color, base, symbol }) => {
  // settings for the window and candle width
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [chartVisible, setChartVisible] = useState(true)

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  // reset view on new address
  const addressPrev = usePrevious(address)
  useEffect(() => {
    if (address !== addressPrev && addressPrev) {
      setChartFilter(CHART_VIEW.LIQUIDITY)
    }
  }, [address, addressPrev])

  let chartData = useTokenChartData(address)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  const prevWindow = usePrevious(timeWindow)

  // switch to hourly data when switched to week window
  useEffect(() => {
    if (timeWindow === timeframeOptions.WEEK && prevWindow && prevWindow !== timeframeOptions.WEEK) {
      setFrequency(DATA_FREQUENCY.HOUR)
    }
    if (timeWindow === timeframeOptions.MONTH && prevWindow && prevWindow !== timeframeOptions.MONTH) {
      setFrequency(DATA_FREQUENCY.DAY)
    }
    if (timeWindow === timeframeOptions.ALL_TIME && prevWindow && prevWindow !== timeframeOptions.ALL_TIME) {
      setFrequency(DATA_FREQUENCY.LINE)
    }
  }, [prevWindow, timeWindow])

  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  let utcStartTime = getTimeframe(timeWindow)

  const aspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22

  chartData = chartData?.filter((entry) => entry.date >= utcStartTime)

  // update the width on a window resize
  // const ref = useRef()
  // const isClient = typeof window === 'object'
  // const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  // useEffect(() => {
  //   if (!isClient) {
  //     return false
  //   }
  //   function handleResize() {
  //     setWidth(ref?.current?.container?.clientWidth ?? width)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  return (
    <ChartWrapper style={isFullScreen ? fullScreenStyle : {}}>
      {/* {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          {chartFilter !== CHART_VIEW.PRICE && (
            <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
          )}
        </RowBetween>
      ) : (
        <RowBetween
          mb={
            chartFilter === CHART_VIEW.LIQUIDITY ||
            chartFilter === CHART_VIEW.VOLUME ||
            (chartFilter === CHART_VIEW.PRICE && frequency === DATA_FREQUENCY.LINE)
              ? 40
              : 0
          }
          align="flex-start"
          style={{ padding: isFullScreen ? '10px' : 0 }}
        >
          <AutoColumn gap="8px">
            {!isFullScreen && (
              <RowFixed>
                <OptionButton
                  active={chartFilter === CHART_VIEW.LIQUIDITY}
                  onClick={() => setChartFilter(CHART_VIEW.LIQUIDITY)}
                  style={{ marginRight: '6px' }}
                >
                  Liquidity
                </OptionButton>

                <OptionButton
                  active={chartFilter === CHART_VIEW.VOLUME}
                  onClick={() => setChartFilter(CHART_VIEW.VOLUME)}
                  style={{ marginRight: '6px' }}
                >
                  Volume
                </OptionButton>

                <OptionButton
                  active={chartFilter === CHART_VIEW.PRICE}
                  onClick={() => {
                    setChartFilter(CHART_VIEW.PRICE)
                  }}
                >
                  Price
                </OptionButton>
              </RowFixed>
            )}
          </AutoColumn>

          {chartFilter !== CHART_VIEW.PRICE && (
            <AutoRow justify="flex-end" gap="6px" align="flex-start" style={{ width: 'auto' }}>
              <OptionButton
                active={timeWindow === timeframeOptions.WEEK}
                onClick={() => setTimeWindow(timeframeOptions.WEEK)}
              >
                1W
              </OptionButton>
              <OptionButton
                active={timeWindow === timeframeOptions.MONTH}
                onClick={() => setTimeWindow(timeframeOptions.MONTH)}
              >
                1M
              </OptionButton>
              <OptionButton
                active={timeWindow === timeframeOptions.ALL_TIME}
                onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
              >
                All
              </OptionButton>
            </AutoRow>
          )}

          {chartFilter === CHART_VIEW.PRICE && (
            <AutoRow justify="flex-end" gap="6px" style={{ width: 'auto' }}>
              <OptionButton
                onClick={() => {
                  if (isFullScreen) {
                    document.body.style.overflow = 'visible'
                  } else {
                    document.body.style.overflow = 'hidden'
                  }
                  setChartVisible(false)
                  setIsFullScreen(!isFullScreen)
                  setTimeout(() => {
                    setChartVisible(true)
                  }, 500)
                }}
              >
                {isFullScreen ? <MinimizeIcon size={16} /> : <MaximizeIcon size={16} />}
              </OptionButton>
            </AutoRow>
          )}
        </RowBetween>
      )} */}
      {chartFilter === CHART_VIEW.LIQUIDITY && chartData && (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={(tick) => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key={'other'}
              dataKey={'totalLiquidityUSD'}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={'Liquidity'}
              yAxisId={0}
              stroke={darken(0.12, color)}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {/* {chartFilter === CHART_VIEW.PRICE &&
        (symbol && chartVisible ? (
          <div style={{ height: isFullScreen ? '100%' : '500px' }}>
            <AdvanceChart
              symbolName={symbol}
              style={{ marginTop: isFullScreen ? 0 : '10px', height: isFullScreen ? 'calc(100% - 60px)' : '100%' }}
              datafeed={datafeed(address, symbol, base)}
            />
          </div>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart margin={{ top: 0, right: 10, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={(tick) => '$' + toK(tick)}
              tickLine={false}
              orientation="right"
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={{ fill: color, opacity: 0.1 }}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={'Volume'}
              dataKey={'dailyVolumeUSD'}
              fill={color}
              opacity={'0.4'}
              yAxisId={0}
              stroke={color}
            />
          </BarChart>
        </ResponsiveContainer>
      )} */}
    </ChartWrapper>
  )
}

export default TokenChart

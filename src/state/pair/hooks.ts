import { useEffect } from 'react'
import { Pair, Token } from '@pangolindex/sdk'
import { client } from '../../apollo/client'
import { HOURLY_PAIR_RATES } from '../../apollo/pair'
import { PRICES_BY_BLOCK } from '../../apollo/block'
import { splitQuery } from 'src/utils/query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePairChartData, updatePairTokensChartData } from 'src/state/pair/actions'
import { getBlocksFromTimestamps } from 'src/state/token/hooks'
import { ChartState } from './reducer'

dayjs.extend(utc)

export function useAllPairChartData(): ChartState | undefined {
  const allTokenCharts = useSelector<AppState, AppState['pair']['pairData']>(state => state?.pair?.pairData || {})

  return allTokenCharts
}

export function usePairHourlyRateData(pairAddress: string, timeWindow: string, interval = 3600, type = 'ALL') {
  const data1 = useAllPairChartData()

  const chartData = data1?.[pairAddress]

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const currentTime = dayjs.utc()

    // February 8th 2021 - Pangolin Factory is created
    const startTime =
      type === 'ALL'
        ? dayjs('2021-02-11')
            .startOf('hour')
            .unix()
        : currentTime
            .subtract(1, timeWindow)
            .startOf('hour')
            .unix()

    async function fetch() {
      let data = await getPairHourlyRateData(pairAddress, startTime, undefined, interval)

      dispatch(updatePairChartData({ address: pairAddress, chartData: data }))
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, timeWindow, pairAddress])

  return chartData
}

export const getPairHourlyRateData = async (
  pairAddress: string,
  startTime: number,
  to = dayjs.utc().unix(),
  interval = 3600 * 24
) => {
  try {
    const utcEndTime = to
    let time = startTime

    // create an array of hour start times until we reach current hour
    const timestamps = []

    while (time < utcEndTime) {
      timestamps.push(time)
      time += interval
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return []
    }

    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks

    blocks = await getBlocksFromTimestamps(timestamps, 100)

    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return []
    }

    const result: any = await splitQuery(HOURLY_PAIR_RATES, client, [pairAddress], blocks, 100)

    // format token ETH price results
    let values = [] as any
    for (var row in result) {
      let timestamp = row.split('t')[1]

      const year = dayjs.utc(dayjs.unix(Number(timestamp))).get('year')
      const month = dayjs.utc(dayjs.unix(Number(timestamp))).get('month') + 1
      const day = dayjs.utc(dayjs.unix(Number(timestamp))).get('date')

      if (timestamp) {
        values.push({
          timestamp: { year: year, month: month, day: day },
          rate0: parseFloat(result[row]?.token0Price) || 0,
          rate1: parseFloat(result[row]?.token1Price) || 0
        })
      }
    }

    let formattedHistoryRate0 = []
    let formattedHistoryRate1 = []

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i].rate0 !== 0) {
        formattedHistoryRate0.push({
          time: values[i].timestamp,
          open: parseFloat(values[i].rate0 || 0),
          close: parseFloat(values[i + 1].rate0 || 0),
          low: parseFloat(values[i].rate0 || 0),
          high: parseFloat(values[i + 1].rate0 || 0)
        })
      }

      if (values[i].rate1 !== 0) {
        formattedHistoryRate1.push({
          time: values[i].timestamp,
          open: parseFloat(values[i].rate1 || 0),
          close: parseFloat(values[i + 1].rate1 || 0),
          low: parseFloat(values[i].rate1 || 0),
          high: parseFloat(values[i + 1].rate1 || 0)
        })
      }
    }

    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log(e)
    return [[], []]
  }
}

export function useAllPairTokensChartData(): ChartState | undefined {
  const allTokenCharts = useSelector<AppState, AppState['pair']['tokenPairData']>(
    state => state?.pair?.tokenPairData || {}
  )

  return allTokenCharts
}

export function useHourlyPairTokensChartData(
  tokenAddress0: string,
  tokenAddress1: string,
  timeWindow: string,
  interval = 3600,
  type = 'ALL'
) {
  tokenAddress0 = (tokenAddress0 || '').toLowerCase()
  tokenAddress1 = (tokenAddress1 || '').toLowerCase()
  const pairAddress = `${tokenAddress0}_${tokenAddress1}`

  const data1 = useAllPairTokensChartData()

  const chartData = data1?.[pairAddress]

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const currentTime = dayjs.utc()

    // February 8th 2021 - Pangolin Factory is created
    const startTime =
      type === 'ALL'
        ? dayjs('2021-02-11')
            .startOf('hour')
            .unix()
        : currentTime
            .subtract(1, timeWindow)
            .startOf('hour')
            .unix()

    async function fetch() {
      let data = await getHourlyPairTokensChartData(tokenAddress0, tokenAddress1, startTime, undefined, interval)

      dispatch(updatePairTokensChartData({ address: pairAddress, chartData: data }))
    }

    if (tokenAddress0 && tokenAddress1) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, timeWindow, pairAddress])

  return chartData
}

export const getHourlyPairTokensChartData = async (
  tokenAddress0: string,
  tokenAddress1: string,
  startTime: number,
  to = dayjs.utc().unix(),
  interval = 3600 * 24
) => {
  const utcEndTime = to
  let time = startTime

  // create an array of hour start times until we reach current hour
  // buffer by half hour to catch case where graph isnt synced to latest block

  const timestamps = [] as Array<number>
  while (time < utcEndTime) {
    timestamps.push(time)
    time += interval
  }

  // backout if invalid timestamp format
  if (timestamps.length === 0) {
    return []
  }

  // once you have all the timestamps, get the blocks for each timestamp in a bulk query
  let blocks
  try {
    blocks = await getBlocksFromTimestamps(timestamps, 100)

    // catch failing case
    if (!blocks || blocks.length === 0) {
      return []
    }

    let result0: any = await splitQuery(PRICES_BY_BLOCK, client, [tokenAddress0], blocks, 50)

    // format token ETH price results
    let values0 = [] as Array<{ timestamp: string; derivedETH: number; ethPrice: number; priceUSD: any }>
    for (let row in result0) {
      let timestamp = row.split('t')[1]
      if (!timestamp) continue

      const derivedETH = parseFloat(result0[`t${timestamp}`]?.derivedETH)
      const ethPrice = parseFloat(result0[`b${timestamp}`]?.ethPrice)
      const priceUSD = ethPrice * derivedETH

      values0.push({
        timestamp,
        derivedETH,
        ethPrice,
        priceUSD
      })
    }

    let result1: any = await splitQuery(PRICES_BY_BLOCK, client, [tokenAddress1], blocks, 50)

    // format token ETH price results
    let values1 = [] as Array<{ timestamp: string; derivedETH: number; ethPrice: number; priceUSD: any }>
    for (let row in result1) {
      let timestamp = row.split('t')[1]
      if (!timestamp) continue

      const derivedETH = parseFloat(result1[`t${timestamp}`]?.derivedETH)
      const ethPrice = parseFloat(result1[`b${timestamp}`]?.ethPrice)
      const priceUSD = ethPrice * derivedETH

      values1.push({
        timestamp,
        derivedETH,
        ethPrice,
        priceUSD
      })
    }

    // we need to take that array which length small and map on that one
    const mapOn = (values0 || []).length >= (values1 || []).length ? 'map1' : 'map0'

    let finalValues = [] as any
    if (mapOn === 'map1') {
      for (var row in values1) {
        let timestamp = values1[row]?.timestamp

        let dayjsTimestamp = dayjs.utc(dayjs.unix(Number(timestamp)))

        const year = dayjsTimestamp.get('year')
        const month = dayjsTimestamp.get('month') + 1
        const day = dayjsTimestamp.get('date')

        let v0 = values0.find(data => data?.timestamp === timestamp)

        let v1 = values1.find(data => data?.timestamp === timestamp)

        const inputUsdcPrice = parseFloat(v1?.priceUSD) || 0

        const outputUsdcPrice = parseFloat(v0?.priceUSD) || 0

        const rate0UsdcPrice =
          inputUsdcPrice && outputUsdcPrice ? Number(inputUsdcPrice.toFixed()) / Number(outputUsdcPrice.toFixed()) : 0

        const rate1UsdcPrice =
          inputUsdcPrice && outputUsdcPrice ? Number(outputUsdcPrice.toFixed()) / Number(inputUsdcPrice.toFixed()) : 0

        if (timestamp) {
          finalValues.push({
            timestamp: { year: year, month: month, day: day },
            rate0: parseFloat(rate0UsdcPrice.toFixed(4)) || 0,
            rate1: parseFloat(rate1UsdcPrice.toFixed(4)) || 0
          })
        }
      }
    } else {
      for (var row in values0) {
        let timestamp = values0[row]?.timestamp
        let dayjsTimestamp = dayjs.utc(dayjs.unix(Number(timestamp)))
        const year = dayjsTimestamp.get('year')
        const month = dayjsTimestamp.get('month') + 1
        const day = dayjsTimestamp.get('date')

        let v0 = values0.find(data => data?.timestamp === timestamp)

        let v1 = values1.find(data => data?.timestamp === timestamp)

        const inputUsdcPrice = parseFloat(v0?.priceUSD) || 0

        const outputUsdcPrice = parseFloat(v1?.priceUSD) || 0

        const rate0UsdcPrice =
          inputUsdcPrice && outputUsdcPrice ? Number(inputUsdcPrice.toFixed()) / Number(outputUsdcPrice.toFixed()) : 0

        const rate1UsdcPrice =
          inputUsdcPrice && outputUsdcPrice ? Number(outputUsdcPrice.toFixed()) / Number(inputUsdcPrice.toFixed()) : 0

        if (timestamp) {
          finalValues.push({
            timestamp: { year: year, month: month, day: day },
            rate0: parseFloat(rate0UsdcPrice.toFixed(4)) || 0,
            rate1: parseFloat(rate1UsdcPrice.toFixed(4)) || 0
          })
        }
      }
    }

    let formattedHistoryRate0 = []
    let formattedHistoryRate1 = []

    // for each hour, construct the open and close price
    for (let i = 0; i < finalValues.length - 1; i++) {
      if (finalValues[i].rate0 !== 0) {
        formattedHistoryRate0.push({
          time: finalValues[i].timestamp,
          open: parseFloat(finalValues[i].rate0 || 0),
          close: parseFloat(finalValues[i + 1].rate0 || 0),
          low: parseFloat(finalValues[i].rate0 || 0),
          high: parseFloat(finalValues[i + 1].rate0 || 0)
        })
      }

      if (finalValues[i].rate1 !== 0) {
        formattedHistoryRate1.push({
          time: finalValues[i].timestamp,
          open: parseFloat(finalValues[i].rate1 || 0),
          close: parseFloat(finalValues[i + 1].rate1 || 0),
          low: parseFloat(finalValues[i].rate1 || 0),
          high: parseFloat(finalValues[i + 1].rate1 || 0)
        })
      }
    }

    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log(e)
    console.log('error fetching blocks')
    return []
  }
}

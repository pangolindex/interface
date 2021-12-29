import { useEffect } from 'react'
import { client } from '../../apollo/client'
import { HOURLY_PAIR_RATES } from '../../apollo/pair'
import { splitQuery } from 'src/utils/query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePairTokenChartData } from 'src/state/pair/actions'
import { getBlocksFromTimestamps } from 'src/state/token/hooks'
import { ChartState } from './reducer'

dayjs.extend(utc)

export function useAllTokenPairChartData(): ChartState | undefined {
  const allTokenCharts = useSelector<AppState, AppState['pair']['pairData']>(state => state?.pair?.pairData || {})

  return allTokenCharts
}

export function useHourlyRateData(pairAddress: string, timeWindow: string, interval = 3600, type = 'ALL') {
  const data1 = useAllTokenPairChartData()

  const chartData = data1?.[pairAddress]

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const currentTime = dayjs.utc()

    // February 8th 2021 - Pangolin Factory is created
    const startTime =
      type === 'ALL'
        ? dayjs('2021-02-08')
            .startOf('hour')
            .unix()
        : currentTime
            .subtract(1, timeWindow)
            .startOf('hour')
            .unix()

    async function fetch() {
      let data = await getHourlyRateData(pairAddress, startTime, undefined, interval)

      dispatch(updatePairTokenChartData({ address: pairAddress, chartData: data }))
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, timeWindow, pairAddress])

  return chartData
}

export const getHourlyRateData = async (
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
      const month = dayjs.utc(dayjs.unix(Number(timestamp))).get('month')
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
      formattedHistoryRate0.push({
        time: values[i].timestamp,
        value: parseFloat(values[i].rate0) || 0
        // close: parseFloat(values[i + 1].rate0),
      })

      formattedHistoryRate1.push({
        time: values[i].timestamp,
        value: parseFloat(values[i].rate1) || 0
        // close: parseFloat(values[i + 1].rate1),
      })
    }

    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log(e)
    return [[], []]
  }
}

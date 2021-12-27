import { createAction } from '@reduxjs/toolkit'

export const updateTokenWeeklyPriceChartData = createAction<{
  address: string
  chartData: Array<{ priceUSD: number; date: string }>
}>('token/updateTokenWeeklyPriceChartData')
// export const getAllTokenWeeklyPriceChartData = createAction<{
//   [address: string]: Array<{ priceUSD: number; date: string }>
// }>('watchlists/getAllTokenWeeklyPriceChartData')

export const updateTokenPriceChartData = createAction<{
  address: string
  chartData: Array<{ priceUSD: number; timestamp: string }>
}>('token/updateTokenPriceChartData')
// export const getAllTokenPriceChartData = createAction<{ [address: string]: Array<{ priceUSD: number; date: string }> }>(
//   'watchlists/getAllTokenPriceChartData'
// )

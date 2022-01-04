import { createAction } from '@reduxjs/toolkit'

export const updateTokenWeeklyPriceChartData = createAction<{
  address: string
  chartData: Array<{ priceUSD: number; date: string }>
}>('token/updateTokenWeeklyPriceChartData')

export const updateTokenPriceChartData = createAction<{
  address: string
  chartData: Array<{ priceUSD: number; timestamp: string }>
}>('token/updateTokenPriceChartData')

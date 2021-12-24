import { createAction } from '@reduxjs/toolkit'

export const updateChartData = createAction<{ address: string; chartData: Array<{ priceUSD: number; date: string }> }>(
  'token/updateChartData'
)
export const getAllTokenChartData = createAction<{ [address: string]: Array<{ priceUSD: number; date: string }> }>(
  'watchlists/getAllTokenChartData'
)

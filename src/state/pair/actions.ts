import { createAction } from '@reduxjs/toolkit'
import { Time } from 'lightweight-charts'

export const updatePairChartData = createAction<{
  address: string
  chartData: Array<Array<{ open: number; close: number; high: number; low: number; time: Time }>>
}>('pair/updatePairChartData')

export const updatePairTokensChartData = createAction<{
  address: string
  chartData: Array<Array<{ open: number; close: number; high: number; low: number; time: Time }>>
}>('pair/updatePairTokensChartData')

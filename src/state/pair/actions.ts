import { createAction } from '@reduxjs/toolkit'
import { Time } from 'lightweight-charts'

export const updatePairTokenChartData = createAction<{
  address: string
  chartData: Array<Array<{ open: number; close: number; high: number; low: number; time: Time }>>
}>('pair/updatePairTokenChartData')

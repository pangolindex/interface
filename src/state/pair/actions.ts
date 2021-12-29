import { createAction } from '@reduxjs/toolkit'
import { Time } from 'lightweight-charts'

export const updatePairTokenChartData = createAction<{
  address: string
  chartData: Array<Array<{ value: number; time: Time }>>
}>('pair/updatePairTokenChartData')

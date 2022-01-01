import { createReducer } from '@reduxjs/toolkit'
import { updateTokenWeeklyPriceChartData, updateTokenPriceChartData } from './actions'

export interface WeeklyState {
  [address: string]: Array<{ priceUSD: number; date: string }>
}

export interface ChartState {
  [address: string]: Array<{ priceUSD: number; timestamp: string }>
}

export interface TokenChartState {
  readonly weekly: WeeklyState
  readonly tokenPrices: ChartState
}

const initialState: TokenChartState = {
  weekly: {},
  tokenPrices: {}
}

export default createReducer(initialState, builder =>
  builder

    .addCase(updateTokenWeeklyPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as WeeklyState
      container[address] = chartData
      const existingChartData = {
        ...(state.weekly || {}),
        ...container
      }
      state.weekly = existingChartData
    })

    .addCase(updateTokenPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as ChartState
      container[address] = chartData
      const existingChartData = {
        ...(state.tokenPrices || {}),
        ...container
      }
      state.tokenPrices = existingChartData
    })
)

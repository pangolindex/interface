import { createReducer } from '@reduxjs/toolkit'
import { updateTokenWeeklyPriceChartData, updateTokenPriceChartData } from './actions'

interface weeklyState {
  [address: string]: Array<{ priceUSD: number; date: string }>
}

interface chartState {
  [address: string]: Array<{ priceUSD: number; timestamp: string }>
}

export interface TokenChartState {
  readonly weekly: weeklyState
  readonly tokenPrices: chartState
}

const initialState: TokenChartState = {
  weekly: {},
  tokenPrices: {}
}

export default createReducer(initialState, builder =>
  builder

    .addCase(updateTokenWeeklyPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as weeklyState
      container[address] = chartData
      const existingChartData = {
        ...(state.weekly || {}),
        ...container
      }
      state.weekly = existingChartData
    })

    .addCase(updateTokenPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as chartState
      container[address] = chartData
      const existingChartData = {
        ...(state.tokenPrices || {}),
        ...container
      }
      state.tokenPrices = existingChartData
    })
)

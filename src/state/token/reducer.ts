import { createReducer } from '@reduxjs/toolkit'
import {
  updateTokenWeeklyPriceChartData,
  // getAllTokenWeeklyPriceChartData,
  // getAllTokenPriceChartData,
  updateTokenPriceChartData
} from './actions'

export interface TokenChartState {
  readonly weekly: {
    [address: string]: Array<{ priceUSD: number; date: string }>
  }
  readonly tokenPrices: {
    [address: string]: Array<{ priceUSD: number; timestamp: string }>
  }
}

const initialState: TokenChartState = {
  weekly: {},
  tokenPrices: {}
}

export default createReducer(initialState, builder =>
  builder
    // .addCase(getAllTokenWeeklyPriceChartData, state => {
    //   const existingChartData = { ...(state.weekly || {}) }

    //   state.weekly = existingChartData
    // })

    .addCase(updateTokenWeeklyPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as { [address: string]: Array<{ priceUSD: number; date: string }> }
      container[address] = chartData
      const existingChartData = {
        ...(state.weekly || {}),
        ...container
      }
      state.weekly = existingChartData
    })

    // .addCase(getAllTokenPriceChartData, state => {
    //   const existingChartData = { ...(state.tokenPrices || {}) }

    //   state.tokenPrices = existingChartData
    // })

    .addCase(updateTokenPriceChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as { [address: string]: Array<{ priceUSD: number; timestamp: string }> }
      container[address] = chartData
      const existingChartData = {
        ...(state.tokenPrices || {}),
        ...container
      }
      state.tokenPrices = existingChartData
    })
)

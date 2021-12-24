import { createReducer } from '@reduxjs/toolkit'
import { updateChartData, getAllTokenChartData } from './actions'

export interface TokenChartState {
  readonly weekly: {
    [address: string]: Array<{ priceUSD: number; date: string }>
  }
}

const initialState: TokenChartState = {
  weekly: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(getAllTokenChartData, state => {
      const existingChartData = { ...(state.weekly || {}) }

      state.weekly = existingChartData
    })

    .addCase(updateChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as any
      container[address] = chartData
      const existingChartData = {
        ...(state.weekly || {}),
        ...container
      }
      state.weekly = existingChartData
    })
)

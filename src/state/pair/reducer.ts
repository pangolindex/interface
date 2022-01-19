import { createReducer } from '@reduxjs/toolkit'
import { updatePairChartData, updatePairTokensChartData } from './actions'
import { Time } from 'lightweight-charts'

export interface ChartState {
  [address: string]: Array<Array<{ open: number; close: number; high: number; low: number; time: Time }>>
}

export interface TokenChartState {
  readonly pairData: ChartState
  readonly tokenPairData: ChartState
}

const initialState: TokenChartState = {
  pairData: {},
  tokenPairData: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updatePairChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as ChartState
      container[address] = chartData
      const existingChartData = {
        ...(state.pairData || {}),
        ...container
      }
      state.pairData = existingChartData
    })

    .addCase(updatePairTokensChartData, (state, { payload: { address, chartData } }) => {
      let container = {} as ChartState
      container[address] = chartData
      const existingChartData = {
        ...(state.tokenPairData || {}),
        ...container
      }
      state.tokenPairData = existingChartData
    })
)

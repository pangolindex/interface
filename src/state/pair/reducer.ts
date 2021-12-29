import { createReducer } from '@reduxjs/toolkit'
import { updatePairTokenChartData } from './actions'
import { Time } from 'lightweight-charts'

export interface ChartState {
  [address: string]: Array<Array<{ value: number; time: Time }>>
}

export interface TokenChartState {
  readonly pairData: ChartState
}

const initialState: TokenChartState = {
  pairData: {}
}

export default createReducer(initialState, builder =>
  builder.addCase(updatePairTokenChartData, (state, { payload: { address, chartData } }) => {
    let container = {} as ChartState
    container[address] = chartData
    const existingChartData = {
      ...(state.pairData || {}),
      ...container
    }
    state.pairData = existingChartData
  })
)

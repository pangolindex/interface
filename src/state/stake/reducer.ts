import { createReducer } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'
import {
  updateMinichefStakingAllData,
  updateMinichefStakingAllAprs,
  updateMinichefStakingAllFarmsEarnedAmount
} from './actions'

export interface MinichefStakingInfoState {
  readonly minichefStakingData: MinichefV2
  readonly aprs: { [key: string]: { pid: string; swapFeeApr: number; stakingApr: number; combinedApr: number } }
  readonly earnedAmounts: { [key: string]: { pid: string; earnedAmount: number } }
}

const initialState: MinichefStakingInfoState = {
  minichefStakingData: {} as MinichefV2,
  aprs: {},
  earnedAmounts: {}
}

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateMinichefStakingAllData, (state, { payload: { data } }) => {
      // console.info('updateMinichefStakingAllData')

      const existingData = { ...(state.minichefStakingData || {}), ...data }

      state.minichefStakingData = existingData
    })

    .addCase(updateMinichefStakingAllAprs, (state, { payload: { data } }) => {
      // console.info('updateMinichefStakingALLAprs')
      state.aprs = data
    })

    .addCase(updateMinichefStakingAllFarmsEarnedAmount, (state, { payload: { data } }) => {
      // console.info('updateMinichefStakingAllFarmsEarnedAmount')
      state.earnedAmounts = data
    })
)

import { createReducer } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'
import {
  updateMinichefStakingAllData,
  updateMinichefStakingAllAprs,
  updateMinichefStakingAllFarmsEarnedAmount
} from './actions'
import { ChainId } from '@pangolindex/sdk'

interface IApr {
  pid: string
  swapFeeApr: number
  stakingApr: number
  combinedApr: number
}

type minichefStakingData = { [chainId in ChainId]: MinichefV2 }
type aprs = { [chainId in ChainId]: { [key: string]: IApr } }
type earnerdAmounts = { [chainId in ChainId]: { [key: string]: { pid: string; earnedAmount: number } } }
export interface MinichefStakingInfoState {
  readonly minichefStakingData: minichefStakingData
  readonly aprs: aprs
  readonly earnedAmounts: earnerdAmounts
}

const initialState: MinichefStakingInfoState = {
  minichefStakingData: {} as minichefStakingData,
  aprs: {} as aprs,
  earnedAmounts: {} as earnerdAmounts
}

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateMinichefStakingAllData, (state, { payload: { data: {chainId, data} } }) => {
      // console.info('updateMinichefStakingAllData')

        const existingData = { ...(state.minichefStakingData[chainId] || {}), ...data }
        state.minichefStakingData[chainId] = existingData
      }
    )

    .addCase(updateMinichefStakingAllAprs, (state, { payload: { data: {chainId, data} } }) => {
      // console.info('updateMinichefStakingALLAprs')
        state.aprs[chainId] = data
      }
    )

    .addCase(updateMinichefStakingAllFarmsEarnedAmount, (state, { payload: { data: {chainId, data} } }) => {
      // console.info('updateMinichefStakingAllFarmsEarnedAmount')
        state.earnedAmounts[chainId] = data
      }
    )
)

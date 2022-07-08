import { createReducer } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'
import {
  updateMinichefStakingAllData,
  updateMinichefStakingAllAprs,
  updateMinichefStakingAllFarmsEarnedAmount
} from './actions'
import { ChainId } from '@pangolindex/sdk'

interface Apr {
  pid: string
  swapFeeApr: number
  stakingApr: number
  combinedApr: number
}

type MinichefStakingData = { [chainId in ChainId]: MinichefV2 }
type Aprs = { [chainId in ChainId]: { [key: string]: Apr } }
type EarnerdAmounts = { [chainId in ChainId]: { [key: string]: { pid: string; earnedAmount: number } } }
export interface MinichefStakingInfoState {
  readonly minichefStakingData: MinichefStakingData
  readonly aprs: Aprs
  readonly earnedAmounts: EarnerdAmounts
}

const initialState: MinichefStakingInfoState = {
  minichefStakingData: {} as MinichefStakingData,
  aprs: {} as Aprs,
  earnedAmounts: {} as EarnerdAmounts
}

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export default createReducer(initialState, builder =>
  builder
    .addCase(
      updateMinichefStakingAllData,
      (
        state,
        {
          payload: {
            data: { chainId, data }
          }
        }
      ) => {
        // console.info('updateMinichefStakingAllData')

        const existingData = { ...(state.minichefStakingData[chainId] || {}), ...data }
        state.minichefStakingData[chainId] = existingData
      }
    )

    .addCase(
      updateMinichefStakingAllAprs,
      (
        state,
        {
          payload: {
            data: { chainId, data }
          }
        }
      ) => {
        // console.info('updateMinichefStakingALLAprs')
        state.aprs[chainId] = data
      }
    )

    .addCase(
      updateMinichefStakingAllFarmsEarnedAmount,
      (
        state,
        {
          payload: {
            data: { chainId, data }
          }
        }
      ) => {
        // console.info('updateMinichefStakingAllFarmsEarnedAmount')
        state.earnedAmounts[chainId] = data
      }
    )
)

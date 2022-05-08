import { createAction } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'

export const updateMinichefStakingAllData = createAction<{
  data: MinichefV2
}>('stake/updateMinichefStakingAllData')

export const updateMinichefStakingAllAprs = createAction<{
  data: any
}>('pair/updateMinichefStakingAllAprs')

export const updateMinichefStakingAllFarmsEarnedAmount = createAction<{
  data: any
}>('pair/updateMinichefStakingAllFarmsEarnedAmount')

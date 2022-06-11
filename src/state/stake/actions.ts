import { ChainId } from '@pangolindex/sdk';
import { createAction } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'

export const updateMinichefStakingAllData = createAction<{
  data: {chainId: ChainId; data: MinichefV2}
}>('stake/updateMinichefStakingAllData')

export const updateMinichefStakingAllAprs = createAction<{
  data: {chainId: ChainId; data: any}
}>('pair/updateMinichefStakingAllAprs')

export const updateMinichefStakingAllFarmsEarnedAmount = createAction<{
  data: {chainId: ChainId; data: any}
}>('pair/updateMinichefStakingAllFarmsEarnedAmount')

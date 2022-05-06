import { createReducer } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'
import { updateMinichefStakingAllData, updateMinichefStakingSingleData } from './actions'

export interface MinichefStakingInfoState {
  readonly minichefStakingData: MinichefV2
}

const initialState: MinichefStakingInfoState = {
  minichefStakingData: {} as MinichefV2
}

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateMinichefStakingAllData, (state, { payload: { data } }) => {
      console.info('updateMinichefStakingAllData')

      const existingData = { ...(state.minichefStakingData || {}), ...data }

      state.minichefStakingData = existingData
    })

    .addCase(updateMinichefStakingSingleData, (state, { payload: { pid, data } }) => {
      console.info('updateMinichefStakingSingleData')
      //Find index of specific object using findIndex method.
      const objIndex = (state.minichefStakingData.farms || []).findIndex(obj => obj.pid === pid)

      const existingData = { ...state.minichefStakingData }

      existingData.farms[objIndex] = { ...existingData.farms[objIndex], ...data }

      state.minichefStakingData = existingData
    })
)
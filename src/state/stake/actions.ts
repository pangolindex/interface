import { createAction } from '@reduxjs/toolkit'
import { MinichefStakingInfo } from './hooks'
import { SortingType } from './reducer'

export const updateMinichefStakingAllData = createAction<{
  data: Array<MinichefStakingInfo>
}>('stake/updateMinichefStakingAllData')

export const updateMinichefStakingSingleData = createAction<{
  pid: string
  data: any
}>('pair/updateMinichefStakingSingleData')

export const sortingMinichefStakingData = createAction<{
  sortBy: SortingType
}>('pair/sortingMinichefStakingData')

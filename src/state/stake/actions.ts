import { createAction } from '@reduxjs/toolkit'
import { MinichefV2 } from './hooks'

export const updateMinichefStakingAllData = createAction<{
  data: MinichefV2
}>('stake/updateMinichefStakingAllData')

export const updateMinichefStakingSingleData = createAction<{
  pid: string
  data: any
}>('pair/updateMinichefStakingSingleData')
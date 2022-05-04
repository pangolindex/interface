import { createReducer } from '@reduxjs/toolkit'
import { MinichefStakingInfo } from './hooks'
import { updateMinichefStakingAllData, updateMinichefStakingSingleData, sortingMinichefStakingData } from './actions'
import { BIG_INT_ZERO } from 'src/constants'

export interface MinichefStakingInfoState {
  readonly minichefStakingData: Array<MinichefStakingInfo>
}

const initialState: MinichefStakingInfoState = {
  minichefStakingData: []
}

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateMinichefStakingAllData, (state, { payload: { data } }) => {
      const existingData = [...(state.minichefStakingData || []), ...data]

      existingData
        .filter(function(info) {
          // Only include pools that are live or require a migration
          return !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
        })
        .sort(function(info_a, info_b) {
          // only first has ended
          if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
          // only second has ended
          if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
          // greater stake in avax comes first
          return info_a.totalStakedInUsd?.greaterThan(
            info_b.totalStakedInUsd ? info_b?.totalStakedInUsd.toExact() : BIG_INT_ZERO
          )
            ? -1
            : 1
        })
        .sort(function(info_a, info_b) {
          // only the first is being staked, so we should bring the first up
          if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && !info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return -1
          // only the second is being staked, so we should bring the first down
          if (!info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return 1
          return 0
        })

      state.minichefStakingData = existingData
    })

    .addCase(updateMinichefStakingSingleData, (state, { payload: { pid, data } }) => {
      //Find index of specific object using findIndex method.
      let objIndex = state.minichefStakingData.findIndex(obj => obj.pid == pid)

      let existingData = [...state.minichefStakingData]

      existingData[objIndex] = { ...existingData[objIndex], ...data }

      state.minichefStakingData = existingData
    })

    .addCase(sortingMinichefStakingData, (state, { payload: { sortBy } }) => {
      let stakingInfoData = state.minichefStakingData

      stakingInfoData.sort(function(info_a, info_b) {
        if (sortBy === SortingType.totalStakedInUsd) {
          return info_a.totalStakedInUsd?.greaterThan(
            info_b.totalStakedInUsd ? info_b?.totalStakedInUsd.toExact() : BIG_INT_ZERO
          )
            ? -1
            : 1
        }

        if (sortBy === SortingType.totalApr) {
          return (info_a?.stakingApr || 0) + (info_a?.swapFeeApr || 0) >
            (info_b?.stakingApr || 0) + (info_b?.swapFeeApr || 0)
            ? -1
            : 1
        }
        return 0
      })

      state.minichefStakingData = stakingInfoData
    })
)

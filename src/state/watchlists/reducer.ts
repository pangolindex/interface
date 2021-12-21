import { createReducer } from '@reduxjs/toolkit'
import { Token } from '@pangolindex/sdk'
import { addCurrency, removeCurrency, getAllSelectedCurrency } from './actions'

export interface WatchlistState {
  readonly currencies: Token[]
}

const initialState: WatchlistState = {
  currencies: []
}

export default createReducer(initialState, builder =>
  builder
    .addCase(getAllSelectedCurrency, (state) => {
      const existingSelectedListUrl = ([] as Token[]).concat(state.currencies || [])
      state.currencies = existingSelectedListUrl

      return {
        ...state
      }
    })
    .addCase(addCurrency, (state, { payload: currency }) => {
      const existingSelectedListUrl = ([] as Token[]).concat(state.currencies || [])

      const index = existingSelectedListUrl.indexOf(currency)

      if (index !== -1) {
        if (existingSelectedListUrl?.length === 1) {
          existingSelectedListUrl.push(currency)
          state.currencies = existingSelectedListUrl
        } else {
          existingSelectedListUrl.splice(index, 1)
          state.currencies = existingSelectedListUrl
        }
      }

      return {
        ...state
      }
    })
    .addCase(removeCurrency, (state, { payload: currency }) => {
      const existingList = ([] as Token[]).concat(state.currencies || [])
      const index = existingList.indexOf(currency)

      if (index !== -1) {
        if (existingList?.length === 1) {
          // if user want to remove the list and if there is only one item in the selected list
          state.currencies = [] as Token[]
        } else {
          existingList.splice(index, 1)
          state.currencies = existingList
        }
      }
    })
)

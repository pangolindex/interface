import {updateQuote} from "./actions";
import {createReducer} from '@reduxjs/toolkit'

const currentTimestamp = () => new Date().getTime()

export interface WyreState {
  quote: any | false,
  timestamp: number
}

export const initialState: WyreState = {
  quote: false,
  timestamp: currentTimestamp(),
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateQuote, (state, action) => {
      state.quote = action.payload.quote
      state.timestamp = currentTimestamp()
    })
)
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import wyre from './wyre/reducer'
import watchlists from './watchlists/reducer'
import token from './token/reducer'
import pair from './pair/reducer'
import { gelatoReducers, GELATO_PERSISTED_KEYS } from '@gelatonetwork/limit-orders-react'

import attestReducer from "../store/attestSlice";
import nftReducer from "../store/nftSlice";
import transferReducer from "../store/transferSlice";
import tokenReducer from "../store/tokenSlice";
import feeReducer from "../store/feeSlice";

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'watchlists', ...GELATO_PERSISTED_KEYS]

export const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    wyre,
    lists,
    watchlists,
    token,
    pair,
    attest: attestReducer,
    nft: nftReducer,
    transfer: transferReducer,
    tokens: tokenReducer,
    fee: feeReducer,
    ...gelatoReducers
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export type RootState = ReturnType<typeof store.getState>;
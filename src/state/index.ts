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
import watchlists from './watchlists/reducer'
import token from './token/reducer'
import pair from './pair/reducer'
import stake from './stake/reducer'
import { createDispatchHook, createSelectorHook, createStoreHook } from 'react-redux'
import React from 'react'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'watchlists', 'stake']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
    watchlists,
    token,
    pair,
    stake
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const InterfaceContext = React.createContext(null as any)

// Export your custom hooks if you wish to use them in other files.
export const useStore = createStoreHook(InterfaceContext)
export const useDispatch = createDispatchHook(InterfaceContext)
export const useSelector = createSelectorHook(InterfaceContext)

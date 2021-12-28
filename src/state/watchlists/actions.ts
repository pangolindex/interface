import { createAction } from '@reduxjs/toolkit'

export const addCurrency = createAction<string>('watchlists/addCurrency')
export const removeCurrency = createAction<string>('watchlists/removeCurrency')

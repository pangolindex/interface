import { createAction } from '@reduxjs/toolkit'
import { Token } from '@pangolindex/sdk'

export const addCurrency = createAction<Token>('watchlists/addCurrency')
export const removeCurrency = createAction<Token>('watchlists/removeCurrency')
export const getAllSelectedCurrency = createAction<Token[]>('watchlists/getAllSelectedCurrency')

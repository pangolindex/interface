import { createAction } from '@reduxjs/toolkit'

export const updateQuote = createAction<{ quote: any }>('price/updateQuote')
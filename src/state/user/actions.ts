import { createAction } from '@reduxjs/toolkit'

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
export const updateWallet = createAction<{ wallet: string | null }>('user/updateWallet')

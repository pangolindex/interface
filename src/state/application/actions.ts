import { createAction } from '@reduxjs/toolkit'

export type PopupContent = {
  txn: {
    hash: string
    success: boolean
    summary?: string
  }
}

export enum ApplicationModal {
  WALLET,
  CLAIM_POPUP,
  DELEGATE,
  VOTE,
  LANGUAGE,
  MIGRATION,
  FARM,
  SINGLE_SIDE_STAKE_DETAIL,
  ACCOUNT_DETAIL
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')

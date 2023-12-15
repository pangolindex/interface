import { useCallback, useMemo } from 'react'
import { useDispatch } from 'src/state'
import { useActiveWeb3React } from '@honeycomb-finance/shared'
import { useActivePopups as useActiveComponentsPopup } from '@honeycomb-finance/state-hooks'
import { AppState, useSelector } from '../index'
import { ApplicationModal, setOpenModal } from './actions'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()
  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useMigrationModalToggle(): () => void {
  return useToggleModal(ApplicationModal.MIGRATION)
}

export function useSingleSideStakingDetailnModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SINGLE_SIDE_STAKE_DETAIL)
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE)
}

export function useAccountDetailToggle(): () => void {
  return useToggleModal(ApplicationModal.ACCOUNT_DETAIL)
}

// get the list of active popups
export function useActivePopups() {
  const popups = useActiveComponentsPopup()
  return useMemo(() => popups.filter((item: any) => item.show), [popups])
}

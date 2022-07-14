import { useCallback, useMemo } from 'react'
import { useDispatch } from 'src/state'
import { useActivePopups as useActiveComponentsPopup } from '@pangolindex/components'
import { useActiveWeb3React } from '../../hooks'
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

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useMigrationModalToggle(): () => void {
  return useToggleModal(ApplicationModal.MIGRATION)
}

export function usePoolDetailnModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POOL_DETAIL)
}

export function useSingleSideStakingDetailnModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SINGLE_SIDE_STAKE_DETAIL)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP)
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP)
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM)
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE)
}

export function useToggleVoteModal(): () => void {
  return useToggleModal(ApplicationModal.VOTE)
}

export function useAccountDetailToggle(): () => void {
  return useToggleModal(ApplicationModal.ACCOUNT_DETAIL)
}

// get the list of active popups
export function useActivePopups() {
  const popups = useActiveComponentsPopup()
  return useMemo(() => popups.filter((item: any) => item.show), [popups])
}

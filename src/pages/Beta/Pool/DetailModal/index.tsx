import React, { useContext, useEffect } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, usePoolDetailnModalToggle } from 'src/state/application/hooks'
import Modal from 'src/components/Beta/Modal'
import { StakingInfo } from 'src/state/stake/hooks'
import { ThemeContext } from 'styled-components'
import DetailView from './DetailView'
import { useDispatch } from 'src/state'
import { resetMintState } from 'src/state/mint/actions'

export interface DetailModalProps {
  stakingInfo: StakingInfo
  version: number
}

const DetailModal = ({ stakingInfo, version }: DetailModalProps) => {
  const detailModalOpen = useModalOpen(ApplicationModal.POOL_DETAIL)
  const togglePoolDetailModal = usePoolDetailnModalToggle()
  const theme = useContext(ThemeContext)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetMintState())
  }, [detailModalOpen, dispatch])

  return (
    <Modal isOpen={detailModalOpen} onDismiss={togglePoolDetailModal} overlayBG={theme.modalBG2}>
      <DetailView stakingInfo={stakingInfo} onDismiss={togglePoolDetailModal} version={version} />
    </Modal>
  )
}
export default DetailModal

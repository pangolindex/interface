import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, usePoolDetailnModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import Modal from 'src/components/Beta/Modal'
import { StakingInfo } from 'src/state/stake/hooks'
import { ThemeContext } from 'styled-components'
import DetailView from './DetailView'

export interface DetailModalProps {
  stakingInfo: StakingInfo
  version: number
  onOpenClaimModal: () => void
  onOpenWithdrawModal: () => void
}

const DetailModal = ({ stakingInfo, version, onOpenClaimModal, onOpenWithdrawModal }: DetailModalProps) => {
  const detailModalOpen = useModalOpen(ApplicationModal.POOL_DETAIL)
  const togglePoolDetailModal = usePoolDetailnModalToggle()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={detailModalOpen} onDismiss={togglePoolDetailModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <DetailView
          stakingInfo={stakingInfo}
          onDismiss={togglePoolDetailModal}
          version={version}
          onOpenClaimModal={onOpenClaimModal}
          onOpenWithdrawModal={onOpenWithdrawModal}
        />
      </Wrapper>
    </Modal>
  )
}
export default DetailModal

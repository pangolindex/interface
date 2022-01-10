import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, usePoolDetailnModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import Modal from '../Modal'
import { StakingInfo } from 'src/state/stake/hooks'
import { ThemeContext } from 'styled-components'
import DetailView from './DetailView'

export interface DetailModalProps {
  selectedPool: StakingInfo
}

const DetailModal = ({ selectedPool }: DetailModalProps) => {
  const detailModalOpen = useModalOpen(ApplicationModal.POOL_DETAIL)
  const togglePoolDetailModal = usePoolDetailnModalToggle()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={detailModalOpen} onDismiss={togglePoolDetailModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <DetailView selectedPool={selectedPool} onDismiss={togglePoolDetailModal} />
      </Wrapper>
    </Modal>
  )
}
export default DetailModal

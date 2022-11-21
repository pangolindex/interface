import React, { useContext } from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useMigrationModalToggle } from '../../state/application/hooks'
import { Wrapper } from './styleds'
import Modal from '../Modal'
import StepView from './StepView'
import { Pair } from '@pangolindex/sdk'
import { StakingInfo } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

export interface MigrationModalProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: StakingInfo } }
  version: number
}

const MigrationModal = ({ selectedPool, version }: MigrationModalProps) => {
  const migrationModalOpen = useModalOpen(ApplicationModal.MIGRATION)
  const toggleMigrationModal = useMigrationModalToggle()
  const theme = useContext(ThemeContext)

  return (
    <Modal
      isOpen={migrationModalOpen}
      onDismiss={toggleMigrationModal}
      minHeight={false}
      maxHeight={180}
      overlayBG={theme.modalBG2}
    >
      <Wrapper>
        <StepView selectedPool={selectedPool} version={version} onDismiss={toggleMigrationModal} />
      </Wrapper>
    </Modal>
  )
}
export default MigrationModal

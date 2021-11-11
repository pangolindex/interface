import React from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useMigrationModalToggle } from '../../state/application/hooks'
import { Wrapper } from './styleds'
import Modal from '../Modal'
import StepView from './StepView'
import { Pair } from '@pangolindex/sdk'
import { StakingInfo } from '../../state/stake/hooks'

export interface MigrationModalProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: StakingInfo } }
  version: number
}

const MigrationModal = ({ selectedPool, version }: MigrationModalProps) => {
  const migrationModalOpen = useModalOpen(ApplicationModal.MIGRATION)
  const toggleMigrationModal = useMigrationModalToggle()

  return (
    <Modal isOpen={migrationModalOpen} onDismiss={toggleMigrationModal} minHeight={false} maxHeight={180}>
      <Wrapper>
        <StepView selectedPool={selectedPool} version={version} onDismiss={toggleMigrationModal}/>
      </Wrapper>
    </Modal>
  )
}
export default MigrationModal

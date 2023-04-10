import React, { useContext } from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useMigrationModalToggle } from '../../state/application/hooks'
import { Wrapper } from './styleds'
import StepView from './StepView'
import { Pair } from '@pangolindex/sdk'
import { MinichefStakingInfo, Modal } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

export interface MigrationModalProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: MinichefStakingInfo } }
  version: number
}

const MigrationModal = ({ selectedPool, version }: MigrationModalProps) => {
  const migrationModalOpen = useModalOpen(ApplicationModal.MIGRATION)
  const toggleMigrationModal = useMigrationModalToggle()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={migrationModalOpen} onDismiss={toggleMigrationModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <StepView selectedPool={selectedPool} version={version} onDismiss={toggleMigrationModal} />
      </Wrapper>
    </Modal>
  )
}
export default MigrationModal

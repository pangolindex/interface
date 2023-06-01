import React from 'react'
import styled from 'styled-components'
import AccountDetails from '../AccountDetails'
import { Modal } from '@pangolindex/components'

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

export default function AccountDetailsModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  open,
  closeModal,
  onWalletChange
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
  open: boolean
  closeModal: () => void
  onWalletChange: () => void
}) {
  const getModalContent = () => {
    return (
      <AccountDetails
        toggleWalletModal={closeModal}
        pendingTransactions={pendingTransactions}
        confirmedTransactions={confirmedTransactions}
        ENSName={ENSName}
        openOptions={onWalletChange}
      />
    )
  }

  return (
    <Modal isOpen={open} onDismiss={closeModal}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}

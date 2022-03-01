import React, { useContext } from 'react'
import { Text, Box } from '@pangolindex/components'
import { Wrapper } from './styleds'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import { Order } from '@gelatonetwork/limit-orders-react'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import CancelOrder from '../CancelOrder'

interface ClaimRewardModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
}

const CancelOrderModal = ({ isOpen, onClose, order }: ClaimRewardModalProps) => {
  // const claimRewardModalOpen = useModalOpen(ApplicationModal.CLAIM_POPUP)
  // const toggleClaimRewardModal = useToggleShowClaimPopup()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('swapPage.cancelOrder')}
          </Text>
          <CloseIcon onClick={() => onClose()} color={theme.text1} />
        </Box>
        <CancelOrder order={order} onClose={() => onClose()} />
      </Wrapper>
    </Modal>
  )
}
export default CancelOrderModal

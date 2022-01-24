import React, { useContext } from 'react'
// import { ApplicationModal } from 'src/state/application/actions'
import { Text, Box } from '@pangolindex/components'
// import { useModalOpen, useToggleShowClaimPopup } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import Modal from '../Modal'
import { ThemeContext } from 'styled-components'
import { StakingInfo } from 'src/state/stake/hooks'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import ClaimReward from '../ClaimReward'

interface ClaimRewardModalProps {
  isOpen: boolean
  version: number
  onClose: () => void
  stakingInfo: StakingInfo
}

const ClaimRewardModal = ({ isOpen, onClose, version, stakingInfo }: ClaimRewardModalProps) => {
  // const claimRewardModalOpen = useModalOpen(ApplicationModal.CLAIM_POPUP)
  // const toggleClaimRewardModal = useToggleShowClaimPopup()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('earn.claim')}
          </Text>
          <CloseIcon onClick={() => onClose()} color={theme.text1} />
        </Box>
        <ClaimReward version={version} stakingInfo={stakingInfo} onClose={() => onClose()} />
      </Wrapper>
    </Modal>
  )
}
export default ClaimRewardModal

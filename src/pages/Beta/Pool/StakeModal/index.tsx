import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { Text, Box } from '@pangolindex/components'
import { useModalOpen, useStakeModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import Stake from '../EarnWidget/Stake'
import { Token } from '@antiyro/sdk'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import { usePair } from 'src/data/Reserves'

interface StakeModalProps {
  clickedLpTokens: Array<Token>
  version: number
}

const StakeModal = ({ clickedLpTokens, version }: StakeModalProps) => {
  const toggleStakeModal = useStakeModalToggle()
  const stakeModalOpen = useModalOpen(ApplicationModal.STAKE)

  const theme = useContext(ThemeContext)

  const { t } = useTranslation()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const [, stakingTokenPair] = usePair(token0, token1)

  return (
    <Modal isOpen={stakeModalOpen} onDismiss={toggleStakeModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('earn.deposit')}
          </Text>
          <CloseIcon onClick={() => toggleStakeModal()} color={theme.text1} />
        </Box>
        <Stake pair={stakingTokenPair} version={version} onComplete={toggleStakeModal} />
      </Wrapper>
    </Modal>
  )
}
export default StakeModal

import React, { useContext } from 'react'
import { Text, Box } from '@0xkilo/components'
import { Wrapper } from './styled'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import DepositWidget from '../DepositWidget'

interface Props {
  isOpen: boolean
  onClose: () => void
  stakingInfo: SingleSideStakingInfo
}

const DepositModal: React.FC<Props> = ({ isOpen, onClose, stakingInfo }: Props) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('earnPage.deposit')}
          </Text>
          <CloseIcon onClick={() => onClose()} color={theme.text1} />
        </Box>
        <DepositWidget stakingInfo={stakingInfo} onClose={onClose} />
      </Wrapper>
    </Modal>
  )
}

export default DepositModal

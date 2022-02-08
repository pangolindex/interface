import React, { useContext } from 'react'
import { Text, Box } from '@pangolindex/components'
import { Wrapper } from './styleds'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import PoolImport from './PoolImport'

interface ClaimRewardModalProps {
  isOpen: boolean
  onClose: () => void
}

const PoolImportModal = ({ isOpen, onClose }: ClaimRewardModalProps) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('navigationTabs.importPool')}
          </Text>
          <CloseIcon onClick={() => onClose()} color={theme.text1} />
        </Box>
        <PoolImport onClose={() => onClose()} />
      </Wrapper>
    </Modal>
  )
}
export default PoolImportModal

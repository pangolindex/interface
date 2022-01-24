import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { Text, Box } from '@pangolindex/components'
import { useModalOpen, useRemoveLiquiditynModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import Modal from '../Modal'
import { ThemeContext } from 'styled-components'
import RemoveLiquidity from '../RemoveLiquidity'
import { Token } from '@pangolindex/sdk'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from 'src/utils/wrappedCurrency'

interface RemoveLiquidityModalProps {
  clickedLpTokens: Array<Token>
}

const RemoveLiquidityModal = ({ clickedLpTokens }: RemoveLiquidityModalProps) => {
  const toggleRemoveLiquidityModal = useRemoveLiquiditynModalToggle()
  const removeLiquidityModalOpen = useModalOpen(ApplicationModal.REMOVE_LIQUIDITY)

  const theme = useContext(ThemeContext)

  const { t } = useTranslation()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = unwrappedToken(token0)
  const currencyB = unwrappedToken(token1)

  return (
    <Modal isOpen={removeLiquidityModalOpen} onDismiss={toggleRemoveLiquidityModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('header.stake')}
          </Text>
          <CloseIcon onClick={() => toggleRemoveLiquidityModal()} color={theme.text1} />
        </Box>
        <RemoveLiquidity currencyA={currencyA} currencyB={currencyB} />
      </Wrapper>
    </Modal>
  )
}
export default RemoveLiquidityModal

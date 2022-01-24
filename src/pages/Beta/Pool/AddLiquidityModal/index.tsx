import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { Text, Box } from '@pangolindex/components'
import { useModalOpen, useAddLiquiditynModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import Modal from '../Modal'
import { ThemeContext } from 'styled-components'
import AddLiquidity from '../EarnWidget/AddLiquidity'
import { Token } from '@pangolindex/sdk'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'

interface AddLiquidityModalProps {
  clickedLpTokens: Array<Token>
}

const AddLiquidityModal = ({ clickedLpTokens }: AddLiquidityModalProps) => {
  const addLiquidityModalOpen = useModalOpen(ApplicationModal.ADD_LIQUIDITY)
  const toggleAddLiquidityModal = useAddLiquiditynModalToggle()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = unwrappedToken(token0)
  const currencyB = unwrappedToken(token1)

  return (
    <Modal isOpen={addLiquidityModalOpen} onDismiss={toggleAddLiquidityModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('stakePage.earn')}
          </Text>
          <CloseIcon onClick={() => toggleAddLiquidityModal()} color={theme.text1} />
        </Box>
        <AddLiquidity currencyA={currencyA} currencyB={currencyB} />
      </Wrapper>
    </Modal>
  )
}
export default AddLiquidityModal

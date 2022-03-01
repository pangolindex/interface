import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { Text, Box } from '@pangolindex/components'
import { useModalOpen, useAddLiquiditynModalToggle } from 'src/state/application/hooks'
import { Wrapper } from './styleds'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import AddLiquidity from '../EarnWidget/AddLiquidity'
import { Token, ChainId } from '@pangolindex/sdk'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from 'src/hooks'

interface AddLiquidityModalProps {
  clickedLpTokens: Array<Token>
}

const AddLiquidityModal = ({ clickedLpTokens }: AddLiquidityModalProps) => {
  const addLiquidityModalOpen = useModalOpen(ApplicationModal.ADD_LIQUIDITY)
  const toggleAddLiquidityModal = useAddLiquiditynModalToggle()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const { chainId } = useActiveWeb3React()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = token0 && unwrappedToken(token0, chainId || ChainId.AVALANCHE)
  const currencyB = token1 && unwrappedToken(token1, chainId || ChainId.AVALANCHE)

  return (
    <Modal isOpen={addLiquidityModalOpen} onDismiss={toggleAddLiquidityModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('pool.addLiquidity')}
          </Text>
          <CloseIcon onClick={() => toggleAddLiquidityModal()} color={theme.text1} />
        </Box>
        <AddLiquidity currencyA={currencyA} currencyB={currencyB} onComplete={toggleAddLiquidityModal} />
      </Wrapper>
    </Modal>
  )
}
export default AddLiquidityModal

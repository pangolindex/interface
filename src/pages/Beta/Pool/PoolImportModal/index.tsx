import React, { useCallback, useContext, useState } from 'react'
import { Text, Box } from '@0xkilo/components'
import { Wrapper } from './styleds'
import Modal from 'src/components/Beta/Modal'
import { ThemeContext } from 'styled-components'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import PoolImport from './PoolImport'
import { CAVAX, Currency, ChainId } from '@antiyro/sdk'
import SelectTokenDrawer from '../../Swap/SelectTokenDrawer'
import { useActiveWeb3React } from 'src/hooks'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

interface ImportPoolModalProps {
  isOpen: boolean
  onClose: () => void
  onManagePoolsClick: () => void
}

const PoolImportModal = ({ isOpen, onClose, onManagePoolsClick }: ImportPoolModalProps) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [currency0, setCurrency0] = useState<Currency | undefined>(CAVAX[chainId || ChainId.AVALANCHE])
  const [currency1, setCurrency1] = useState<Currency | undefined>(undefined)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('navigationTabs.importPool')}
          </Text>
          <CloseIcon onClick={() => onClose()} color={theme.text1} />
        </Box>
        <PoolImport
          onClose={() => onClose()}
          currency0={currency0}
          currency1={currency1}
          openTokenDrawer={() => setShowSearch(true)}
          setActiveField={setActiveField}
          onManagePoolsClick={onManagePoolsClick}
        />

        <SelectTokenDrawer
          isOpen={showSearch}
          onClose={handleSearchDismiss}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={activeField === Fields.TOKEN0 ? currency0 : currency1}
          otherSelectedCurrency={activeField === Fields.TOKEN0 ? currency1 : currency0}
        />
      </Wrapper>
    </Modal>
  )
}
export default PoolImportModal

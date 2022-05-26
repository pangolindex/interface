import React, { useCallback, useContext, useState } from 'react'
import { Box, SelectTokenDrawer, Text } from '@pangolindex/components'
import Modal from 'src/components/Beta/Modal'
import { CloseIcon } from 'src/theme/components'
import SearchToken, { Fields, BodyState } from './SearchToken'
import AddLiquidity from '../EarnWidget/AddLiquidity'
import { Wrapper } from './styleds'
import { ThemeContext } from 'styled-components'
import { CAVAX, Currency } from '@pangolindex/sdk'
import { useChainId } from 'src/hooks'

import { useTranslation } from 'react-i18next'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const AddLiquidityModal = ({ isOpen, onClose }: Props) => {
  const theme = useContext(ThemeContext)
  const chainId = useChainId()

  const { t } = useTranslation()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN0)
  const [currency0, setCurrency0] = useState<Currency | undefined>(CAVAX[chainId])
  const [currency1, setCurrency1] = useState<Currency | undefined>(undefined)

  const [showSearch, setShowSearch] = useState<boolean>(false)

  const [bodyState, setBodyState] = useState<BodyState>(BodyState.SELECT_TOKENS)

  const onTokenClick = useCallback(
    (field: Fields) => {
      setActiveField(field)
      setShowSearch(true)
    },
    [setActiveField, setShowSearch]
  )

  const switchCurrencies = useCallback(() => {
    const temp = currency0
    setCurrency0(currency1)
    setCurrency1(temp)
  }, [currency0, currency1])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setShowSearch(false)
      if (activeField === Fields.TOKEN0) {
        if (currency1 === currency) {
          switchCurrencies()
        } else {
          setCurrency0(currency)
        }
      } else {
        if (currency0 === currency) {
          switchCurrencies()
        } else {
          setCurrency1(currency)
        }
      }
    },
    [activeField, switchCurrencies, currency0, currency1]
  )

  function renderTitle() {
    if (bodyState === BodyState.SELECT_TOKENS) {
      return t('poolFinder.selectToken')
    } else if (bodyState === BodyState.ADD_LIQUIDITY) {
      return t('poolFinder.addLiquidity')
    } else {
      return t('navigationTabs.createPair')
    }
  }

  function renderBody() {
    if (bodyState === BodyState.SELECT_TOKENS) {
      return (
        <>
          <SearchToken currency0={currency0} currency1={currency1} onTokenClick={onTokenClick} onClick={setBodyState} />
          <SelectTokenDrawer
            isOpen={showSearch}
            currency0={currency0}
            currency1={currency1}
            onCurrencySelect={handleCurrencySelect}
            onClose={() => setShowSearch(false)}
          />
        </>
      )
    } else if (currency0 && currency1) {
      return <AddLiquidity currencyA={currency0} currencyB={currency1} type="card" onComplete={() => setBodyState(0)} />
    }
    return <></>
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Box p={10} display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {renderTitle()}
          </Text>
          <CloseIcon
            onClick={() => {
              if (bodyState === BodyState.SELECT_TOKENS) {
                onClose()
              } else {
                setBodyState(0)
              }
            }}
            color={theme.text1}
          />
        </Box>
        <Box width="100%">{renderBody()}</Box>
      </Wrapper>
    </Modal>
  )
}

export default AddLiquidityModal

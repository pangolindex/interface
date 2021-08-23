import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import FiatSearchModal from './FiatSearchModal'
import { Fiat } from '../../constants/fiat'
import { Input as NumericalInput } from '../NumericalInput'
import {StyledEthereumLogo as FiatLogo} from "../CurrencyLogo";
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import {StyledTokenName as StyledFiatName} from "../CurrencyInputPanel";

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const FiatSelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`


interface FiatInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onFiatSelect?: (currency: Fiat) => void
  fiat: Fiat
  hideInput?: boolean
  id: string
}

export default function FiatInputPanel({
  value,
  onUserInput,
  onFiatSelect,
  fiat,
  hideInput = false,
  id,
}: FiatInputPanelProps) {

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={true}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
            </>
          )}
          <FiatSelect
            selected={!!fiat}
            type="button"
            className="open-currency-select-button"
            onClick={() => {
                setModalOpen(true)
            }}
          >
            <Aligner>
              <FiatLogo src={fiat.logo} size={'24px'} alt={fiat.name}/>
              <StyledFiatName className="token-symbol-container" active={Boolean(fiat && fiat.symbol)}>
                {fiat.symbol}
              </StyledFiatName>
              <StyledDropDown selected={!!fiat} />
            </Aligner>
          </FiatSelect>
        </InputRow>
      </Container>
      {onFiatSelect && (
        <FiatSearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onFiatSelect={onFiatSelect}
          selectedFiat={fiat}
        />
      )}
    </InputPanel>
  )
}

import React from 'react'
import styled from 'styled-components'
import {TokenConfig,} from '../../contexts/chainbridge/chainbridgeConfig'
import DropdownSelect, {CustomDropdownProps, OptionType,} from './DropdownSelector'
import {Input as NumericalInput} from '../NumericalInput'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const InputRow = styled.div`
  ${({theme}) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

const InputContainer = styled.div`
  border-radius: 20px;
  border: 1px solid ${({theme}) => theme.bg2};
  background-color: ${({theme}) => theme.bg1};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({theme}) => theme.primary5};
  border: 1px solid ${({theme}) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({theme}) => theme.primaryText1};

  :hover {
    border: 1px solid ${({theme}) => theme.primary1};
  }

  :focus {
    border: 1px solid ${({theme}) => theme.primary1};
    outline: none;
  }

  ${({theme}) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`


interface TokenSelectInputProps extends CustomDropdownProps {
  amount: string
  tokens: TokenConfig[]
  options: OptionType[]
  sync?: (value: number) => void
  onMax?: () => void
  maxDisabled?: boolean
  onUserInput: (value: string) => void
  name: string
  label: string
  disabled?: boolean
}

export default function TokenSelectInput({
                                           amount,
                                           name,
                                           tokens,
                                           sync,
                                           options,
                                           disabled,
                                           onChange,
                                           onMax,
                                           maxDisabled,
                                           onUserInput,
                                           ...rest
                                         }: TokenSelectInputProps) {


  return (
    <Container>
      <InputContainer>
        <InputRow>
          <>
            <NumericalInput
              className='token-amount-input'
              value={amount}
              onUserInput={val => {
                onUserInput(val)
              }}
            />
            <StyledBalanceMax disabled={maxDisabled} onClick={onMax}>MAX</StyledBalanceMax>
          </>
        </InputRow>
        <DropdownSelect
          label={'Select a token'}
          options={options}
          disabled={disabled}
          allowSearch={true}
          onChange={(option) => {
            sync && sync(option.value)
          }}
        />
      </InputContainer>
    </Container>
  )
}

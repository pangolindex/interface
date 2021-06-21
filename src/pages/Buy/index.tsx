import AppBody from "../AppBody";
import {Wrapper} from "../../components/swap/styleds";
import React, {useContext, useState, useEffect} from 'react'
import {Input as NumericalInput} from "../../components/NumericalInput";
import styled, { ThemeContext } from 'styled-components'
import {RowBetween} from "../../components/Row";
import { darken } from 'polished'
import {TYPE} from "../../theme";
import PurchaseForm, {Data } from "../../components/PurchaseForm"
import TextInput from "../../components/PurchaseForm/input"
import {ButtonPrimary} from "../../components/Button";

const InputRow = styled.div`
  ${({theme}) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;`

const InputPanel = styled.div`
  ${({theme}) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 8px;
  background-color: ${({theme}) => theme.bg2};
  z-index: 1;
`

const Container = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`
const emailPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;

const minLengthValidator = (val: string): string[] => {
  if (val) {
    return []
  } else {
    return ["Please enter at least one character"]
  }
}

const emailValidator = (val: string): string[] => {
  if (val && emailPattern.test(val)) {
    return []
  }
  else {
    return ["Please enter a valid email address"]
  }

}

export default function Buy() {

  const [amount, setAmount] = useState('')
  useEffect(() => console.log(amount), [amount])

  const theme = useContext(ThemeContext)
  return (
    <>

      <AppBody>
        <Wrapper id="swap-page">
          Buy Ser?
          <PurchaseForm onSubmit={(data: Data) => console.log(data)}>
            <TextInput type="text" name="firstName" placeholder="First name" validators={[minLengthValidator]}></TextInput>
            <TextInput type="text" name="lastName" placeholder="Last name" validators={[minLengthValidator]}></TextInput>
            <TextInput type="text" name="email" placeholder="Email" validators={[emailValidator, minLengthValidator]}></TextInput>
            <TextInput type="text" name="money" placeholder="0.0" onChange={setAmount}></TextInput>
            <ButtonPrimary type="submit" style={{ margin: '20px 0 0 0' }}>
              Go
            </ButtonPrimary>
          </PurchaseForm>
          <Container>
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  Currency
                </TYPE.body>
              </RowBetween>
            </LabelRow>


          </Container>
          <InputPanel id="amountInput">
            <Container>
              <LabelRow>
                <RowBetween>
                  <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                    USD
                  </TYPE.body>
                </RowBetween>
              </LabelRow>
              <InputRow>
                <NumericalInput title="Amount in USD" value={0} onUserInput={val => (val)}></NumericalInput>
              </InputRow>
            </Container>
          </InputPanel>
        </Wrapper>
      </AppBody>
    </>)
}
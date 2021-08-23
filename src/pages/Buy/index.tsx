import AppBody from "../AppBody";
import {Wrapper} from "../../components/swap/styleds";
import React, {useState} from 'react'
import {TYPE} from "../../theme";
import PurchaseForm, {Data } from "../../components/PurchaseForm"
import TextInput from "../../components/PurchaseForm/input"
import {ButtonPrimary} from "../../components/Button";
import {AutoColumn, ColumnCenter} from "../../components/Column";
import {OutlineCard} from "../../components/Card";
import FiatInputPanel from "../../components/FiatInputPanel";
import { USD } from '../../constants/fiat'
import {useQuoteRequest} from '../../state/wyre/hooks'
import {useActiveWeb3React} from "../../hooks";
import Footer from "../../components/FiatInputPanel/Footer";
import {redirectToWyre} from "./redirect";

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
  const { account } = useActiveWeb3React()
  const [amount, setAmount] = useState('')
  const [fieldError, setFieldError] = useState(true)
  const [formError, setFormError] = useState(false)
  const [fiat, setFiat] = useState(USD)
  useQuoteRequest(account, amount, fiat.symbol)
  const ableToBuy = account && Number(amount) && !fieldError

  const handleSubmit = (data: Data) => {
    const formDataWithAmount = {...data,
      amount: amount,
      sourceCurrency: fiat.symbol,
      dest: `avalanche:${account?.toLowerCase()}`
    }
    redirectToWyre(formDataWithAmount)
      .then(
        (success) => {
          setFormError(!success)
        })

  }

  return (
    <>
      <AppBody>
        <Wrapper id="swap-page">
          <ColumnCenter>
              <AutoColumn gap="10px">
                <OutlineCard>
                <TYPE.link fontSize={14} fontWeight={500} color={'primaryText2'}>
                  Buy AVAX with fiat from our partner Sendwyre.<br/>
                  Pangolin does not store your purchase history or any personal data.
                </TYPE.link>
                </OutlineCard>
              </AutoColumn>
          </ColumnCenter>
          <p></p>
          <PurchaseForm onSubmit={handleSubmit}>
            <TextInput type="text" name="firstName" placeholder="First name" validators={[minLengthValidator]} onError={setFieldError}></TextInput>
            <TextInput type="text" name="lastName" placeholder="Last name" validators={[minLengthValidator]} onError={setFieldError}></TextInput>
            <TextInput type="text" name="email" placeholder="Email" validators={[emailValidator, minLengthValidator]} onError={setFieldError}></TextInput>
            <FiatInputPanel fiat={fiat} value={amount} onUserInput={setAmount} onFiatSelect={setFiat} id="fiatPanel"/>
            {formError ? <TYPE.error title={'Error'} error>An error occurred while submitting the data to Sendwyre</TYPE.error> : null}
            <ButtonPrimary type="submit" style={{ margin: '20px 0 0 0' }} disabled={!ableToBuy}>
              Buy AVAX
            </ButtonPrimary>
          </PurchaseForm>

        </Wrapper>
      </AppBody>
      <Footer/>
    </>)
}
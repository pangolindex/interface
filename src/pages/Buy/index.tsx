import AppBody from '../AppBody'
import { Wrapper } from '../../components/swap/styleds'
import React, { useMemo, useState } from 'react'
import { TYPE } from '../../theme'
import PurchaseForm, { Data } from '../../components/PurchaseForm'
import TextInput from '../../components/PurchaseForm/input'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { OutlineCard } from '../../components/Card'
import FiatInputPanel from '../../components/FiatInputPanel'
import { USD } from '../../constants/fiat'
import { useQuoteRequest } from '../../state/wyre/hooks'
import { useActiveWeb3React } from '../../hooks'
import Footer from '../../components/FiatInputPanel/Footer'
import { redirectToWyre } from './redirect'
import { useTranslation } from '@pangolindex/components'
import MasterCardWhiteLogo from '../../assets/images/mc_hrz_rev_white.svg'
import MasterCardBlackLogo from '../../assets/images/mc_hrz_pos_black.svg'
import VisaWhiteLogo from '../../../src/assets/images/Visa_Brandmark_White_RGB_2021.png'
import VisaBlackLogo from '../../../src/assets/images/Visa_Brandmark_Blue_RGB_2021.png'
import ApplePayIcon from '../../../src/assets/images/Apple_Pay_Mark_RGB_041619.svg'
import { AutoRow } from '../../components/Row'
import styled from 'styled-components'
import { useIsDarkMode } from '../../state/user/hooks'

const CardImage = styled.img`
  width: 70px;
  height: 28px;
`

const emailPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/

const minLengthValidator = (val: string): string[] => {
  if (val) {
    return []
  } else {
    return ['Please enter at least one character']
  }
}

const emailValidator = (val: string): string[] => {
  if (val && emailPattern.test(val)) {
    return []
  } else {
    return ['Please enter a valid email address']
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
  const { t } = useTranslation()
  const darkMode = useIsDarkMode()

  const handleSubmit = (data: Data) => {
    const formDataWithAmount = {
      ...data,
      amount: amount,
      sourceCurrency: fiat.symbol,
      dest: `avalanche:${account?.toLowerCase()}`
    }
    redirectToWyre(formDataWithAmount).then(success => {
      setFormError(!success)
    })
  }

  const validators = useMemo(() => [minLengthValidator], [])
  const emailValidators = useMemo(() => [emailValidator, minLengthValidator], [])

  return (
    <>
      <AppBody>
        <Wrapper id="swap-page">
          <ColumnCenter>
            <AutoColumn gap="10px">
              <OutlineCard>
                <TYPE.link fontSize={14} fontWeight={500} color={'primaryText2'}>
                  {t('buyPage.buyAvaxInfo')}
                  <br />
                  {t('buyPage.privacyInfo')}
                </TYPE.link>
                <br />
                <AutoRow gap="3px" justify={'center'}>
                  {darkMode ? (
                    <CardImage src={MasterCardWhiteLogo} alt={'Master Card'} />
                  ) : (
                    <CardImage src={MasterCardBlackLogo} alt={'Master Card'} />
                  )}
                  {darkMode ? (
                    <CardImage src={VisaWhiteLogo} alt={'VISA'} />
                  ) : (
                    <CardImage src={VisaBlackLogo} alt={'VISA'} />
                  )}
                  <CardImage src={ApplePayIcon} alt={'Apple Pay'} />
                </AutoRow>
              </OutlineCard>
            </AutoColumn>
          </ColumnCenter>
          <PurchaseForm onSubmit={handleSubmit}>
            <TextInput
              type="text"
              name="firstName"
              placeholder={t('buyPage.firstName')}
              validators={validators}
              onError={setFieldError}
            />
            <TextInput
              type="text"
              name="lastName"
              placeholder={t('buyPage.lastName')}
              validators={validators}
              onError={setFieldError}
            />
            <TextInput
              type="text"
              name="email"
              placeholder={t('buyPage.email')}
              validators={emailValidators}
              onError={setFieldError}
            />
            <FiatInputPanel fiat={fiat} value={amount} onUserInput={setAmount} onFiatSelect={setFiat} id="fiatPanel" />
            {formError ? (
              <TYPE.error title={'Error'} error>
                An error occurred while submitting the data to Wyre
              </TYPE.error>
            ) : null}
            <ButtonPrimary type="submit" style={{ margin: '20px 0 0 0' }} disabled={!ableToBuy}>
              {t('buyPage.buyAvax')}
            </ButtonPrimary>
          </PurchaseForm>
        </Wrapper>
      </AppBody>
      <Footer />
    </>
  )
}

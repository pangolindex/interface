import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pangolindex/components'
import Card from 'src/components/Card'
import { MOONPAY_PK, COINBASE_PK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { TopContainer } from 'src/pages/Dashboard/styleds'

import { CardTitle, Title } from '../Governance/GovernanceCard/styleds'
import { WalletText, PayButton, CBIcon, BackButton, BackRow } from './styleds'
import CoinbasePayIcon from 'src/assets/svg/coinbase_coin_pay_blue.svg'

export default function BuyV2() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [activeOnRamp, setActiveOnRamp] = useState('')
  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `

  const buy = (provider: string) => {
    setActiveOnRamp(provider)
  }

  const back = () => {
    setActiveOnRamp('')
  }

  let url
  if (activeOnRamp === 'coinbase')
    url = `https://pay.coinbase.com/buy/select-asset?appId=${COINBASE_PK}&destinationWallets=%5B%7B%22address%22%3A%22${walletAddr}%22%2C%22blockchains%22%3A%5B%22avalanche-c-chain%22%5D%7D%5D`
  if (activeOnRamp === 'moonpay') url = `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`
  if (url) {
    return (
      <>
        <BackRow>
          <BackButton variant="plain" onClick={back}>
            {t('buyPage.back', { defaultValue: 'Back' })}
          </BackButton>
        </BackRow>

        <Iframe
          title="Buy"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
          width="100%"
          height="100%"
          src={url}
        >
          <p>{t('buyPage.iframeSupport', { defaultValue: 'Your browser does not support iframes.' })}</p>
        </Iframe>
      </>
    )
  } else {
    return (
      <TopContainer>
        <Card>
          <CardTitle>
            <Title>Coinbase Pay</Title>
          </CardTitle>
          <PayButton variant="primary" onClick={() => buy('coinbase')} isDisabled={!account}>
            <CBIcon src={CoinbasePayIcon} />
            {t('buyPage.buy', { defaultValue: 'Buy Now' })}
          </PayButton>
          {!account && (
            <WalletText>{t('buyPage.connectWallet', { defaultValue: 'Please connect a wallet' })}</WalletText>
          )}
        </Card>
        <Card>
          <CardTitle>
            <Title>MoonPay</Title>
          </CardTitle>
          <PayButton variant="primary" onClick={() => buy('moonpay')}>
            {t('buyPage.buy', { defaultValue: 'Buy Now' })}
          </PayButton>
        </Card>
      </TopContainer>
    )
  }
}

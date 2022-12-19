import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '@pangolindex/components'
import Card from 'src/components/Card'
import { MOONPAY_PK, COINBASE_PK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { TopContainer } from 'src/pages/Dashboard/styleds'

import { CardTitle, Title } from '../Governance/GovernanceCard/styleds'
import { WalletText, BackButton, BackRow } from './styleds'

import { useLocation } from 'react-router-dom'

export default function BuyV2() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `

  let url
  const activeOnRamp = queryParams.get('provider')
  if (activeOnRamp === 'coinbase')
    url = `https://pay.coinbase.com/buy/select-asset?appId=${COINBASE_PK}&destinationWallets=%5B%7B%22address%22%3A%22${account}%22%2C%22blockchains%22%3A%5B%22avalanche-c-chain%22%5D%7D%5D`
  if (activeOnRamp === 'moonpay') url = `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`

  if (activeOnRamp === 'coinbase' && !account) {
    return (
      <TopContainer>
        <Card>
          <CardTitle>
            <Title>Coinbase Pay</Title>
          </CardTitle>
          <WalletText>{t('buyPage.connectWallet', { defaultValue: 'Please connect a wallet' })}</WalletText>
        </Card>
      </TopContainer>
    )
  }

  if (url) {
    return (
      <>
        <BackRow>
          <BackButton variant="plain">
            <NavLink to="/">{t('buyPage.back', { defaultValue: 'Back' })}</NavLink>
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
    return null
  }
}

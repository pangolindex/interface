import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export default function BuyV2() {
  const CommingSoon = styled.div`
    color: ${({ theme }) => theme.text1};
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  `

  // const Iframe = styled.iframe`
  //   border: 0;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  // `
  // // TODO: we can add this key in the env, it is not necessary to hide it because it's a public key
  // const MOONPAY_KEY = "pk_test_bHHrGHkNhDc0YXxbj0L1Yt9A0lOK64cD"

  // const url = `https://buy-staging.moonpay.io?apiKey=${MOONPAY_KEY}`
  // return (
  //   <Iframe
  //     title="Buy"
  //     allow="accelerometer; autoplay; camera; gyroscope; payment"
  //     width="100%"
  //     height="100%"
  //     src={url}
  //   >
  //     <p>Your browser does not support iframes.</p>
  //   </Iframe>
  //   )

  const { t } = useTranslation()

  return (
    <CommingSoon>
      {t('swapPage.comingSoon')}
    </CommingSoon>
  )
}

import React from 'react'
import { MOONPAY_PK } from 'src/constants'
import styled from 'styled-components'

export default function BuyV2() {
  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `

  const url = `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`
  return (
    <Iframe
      title="Buy"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      width="100%"
      height="100%"
      src={url}
    >
      <p>Your browser does not support iframes.</p>
    </Iframe>
  )
}
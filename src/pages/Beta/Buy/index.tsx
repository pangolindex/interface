import React from 'react'
import { useParams } from 'react-router-dom'
import { MOONPAY_PK, BUY_MENU_LINK } from 'src/constants'
import styled from 'styled-components'

export interface BuyProps {
  type: string
}

export default function BuyV2() {
  const params = useParams<BuyProps>()

  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `

  const url =
    params?.type === BUY_MENU_LINK.moonpay
      ? `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`
      : `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`
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

import React from 'react'
import { C14_ASSET_ID } from 'src/constants'
import styled from 'styled-components'

export default function C14() {
  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    @media (max-width: 960px) {
      top: 80px;
    }
  `

  return (
    <Iframe
      title="Buy"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      width="100%"
      height="100%"
      src={`https://pay.c14.money/?targetAssetId=${C14_ASSET_ID}`}
    >
      <p>Your browser does not support iframes.</p>
    </Iframe>
  )
}

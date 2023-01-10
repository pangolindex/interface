import { Box, useWalletModalToggle } from '@pangolindex/components'
import React from 'react'
import { useParams } from 'react-router-dom'
import { MOONPAY_PK, BUY_MENU_LINK, COINBASE_PK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import styled from 'styled-components'
import { ToggleWalletButton, WalletIcon } from './styled'
export interface BuyProps {
  type: string
}

export default function BuyV2() {
  const params = useParams<BuyProps>()
  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle()

  const Iframe = styled.iframe`
    border: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `

  // coinbase pay needs an account, so if user is not connected then ask to connect wallet
  if (!account && params?.type === BUY_MENU_LINK.coinbasePay) {
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          maxWidth={250}
          margin="0px auto"
          justifyContent="center"
          width="100%"
          height="100%"
          flex={1}
        >
          <ToggleWalletButton variant="primary" onClick={toggleWalletModal} width="100%">
            <WalletIcon color="black" />
            Connect Wallet
          </ToggleWalletButton>
        </Box>
      </>
    )
  }

  const url =
    params?.type === BUY_MENU_LINK.moonpay
      ? `https://buy.moonpay.io?apiKey=${MOONPAY_PK}`
      : `https://pay.coinbase.com/buy/select-asset?appId=${COINBASE_PK}&destinationWallets=%5B%7B%22address%22%3A%22${account}%22%2C%22blockchains%22%3A%5B%22avalanche-c-chain%22%5D%7D%5D`
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

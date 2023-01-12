import { Box, useWalletModalToggle } from '@pangolindex/components'
import React from 'react'
import { useParams } from 'react-router-dom'
import { BUY_MENU_LINK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { ToggleWalletButton, WalletIcon } from './styled'
import CoinbasePay from './CoinbasePay'
import Moonpay from './Moonpay'
export interface BuyProps {
  type: string
}

export default function BuyV2() {
  const params = useParams<BuyProps>()
  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle()

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
  } else if (account && params?.type === BUY_MENU_LINK.coinbasePay) {
    return <CoinbasePay />
  }

  return <Moonpay />
}

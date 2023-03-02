import React, { useEffect, useState } from 'react'
import { CBPayInstanceType, initOnRamp } from '@coinbase/cbpay-js'
import { COINBASE_PK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { ToggleWalletButton, WalletIcon } from '../styled'
import { Box, useWalletModalToggle } from '@pangolindex/components'

export default function CoinbasePay() {
  const [init, setInit] = useState(false)
  const { account } = useActiveWeb3React()
  const [coinbasePayInstance, setCoinbasePayInstance] = useState<CBPayInstanceType | null>(null)
  const toggleWalletModal = useWalletModalToggle()

  useEffect(() => {
    if (init) return
    if (!account) return
    setInit(true)

    initOnRamp(
      {
        appId: COINBASE_PK,
        widgetParameters: {
          destinationWallets: [
            {
              address: account,
              blockchains: ['avalanche-c-chain']
            }
          ]
        },
        experienceLoggedIn: 'embedded',
        experienceLoggedOut: 'popup'
      },
      (err, instance) => {
        if (err) {
          console.error(err)
        } else if (instance) {
          setCoinbasePayInstance(instance)
          instance.open()
        }
      }
    )
  }, [account, init])

  const openCoinbasePay = () => {
    if (coinbasePayInstance) {
      coinbasePayInstance.open()
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={350}
      margin="0px auto"
      justifyContent="center"
      width="100%"
      height="100%"
      flex={1}
    >
      {/* coinbase pay needs an account, so if user is not connected then ask to connect wallet */}
      {!account ? (
        <Box>
          <Box bgColor="black" borderRadius="5px" mb="10px" color="white" p="10px">
            To use Coinbase Pay first you need to connect your wallet to Pangolin dApp. Please proceed by clicking
            button below.
          </Box>
          <ToggleWalletButton variant="primary" onClick={toggleWalletModal} width="100%">
            <WalletIcon color="black" />
            Connect Wallet
          </ToggleWalletButton>
        </Box>
      ) : (
        <Box>
          <Box bgColor="black" borderRadius="5px" mb="10px" color="white" p="10px">
            You will be redirected to Coinbase Pay shortly, if not please click below button
          </Box>
          <ToggleWalletButton
            variant="primary"
            onClick={openCoinbasePay}
            width="100%"
            isDisabled={!coinbasePayInstance}
          >
            {!coinbasePayInstance ? 'Loading...' : 'Open Coinbase Pay'}
          </ToggleWalletButton>
        </Box>
      )}
    </Box>
  )
}

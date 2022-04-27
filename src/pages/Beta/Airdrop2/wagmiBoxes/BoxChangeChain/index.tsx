import React from 'react'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IChangeChain = {
  changeChain: () => void
}

export const BoxChangeChain: React.FC<IChangeChain> = ({ changeChain }) => {
  const switchNetworkFantom = async () => {
    changeChain()
    try {
      // @ts-ignore
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2B67' }]
      })
    } catch (error) {
      // @ts-ignore
      if (error.code === 4902) {
        try {
          // @ts-ignore
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2B67',
                chainName: 'WAGMI',
                rpcUrls: ['https://subnets.avax.network/wagmi/wagmi-chain-testnet/rpc'],
                nativeCurrency: {
                  name: 'WGM',
                  symbol: 'WGM',
                  decimals: 18
                },
                blockExplorerUrls: ['https://subnets.avax.network/wagmi/wagmi-chain-testnet/explorer']
              }
            ]
          })
        } catch (error) {
          // @ts-ignore
          alert(error.message)
        }
      }
    }
  }

  return (
    <ClaimBox>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          You are eligible
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Go to Wagmi to see if you are eligible!
      </Text>
      <span style={{ padding: '20px' }}></span>
      <Button variant="primary" color="white" height="46px" onClick={switchNetworkFantom}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>GO TO WAGMI</span>
      </Button>
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

import React from 'react'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import CostonLogo from 'src/assets/images/flare.jpeg'

type IChangeChain = {
  changeChainCoston: () => void
}

export const BoxChangeChainCoston: React.FC<IChangeChain> = ({ changeChainCoston }) => {
  const switchNetworkCoston = async () => {
    console.log('hello')
    changeChainCoston()

    try {
      // @ts-ignore
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x10' }]
      })
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          // @ts-ignore
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x10',
                chainName: 'Coston',
                rpcUrls: ['https://coston-api.flare.network/ext/bc/C/rpc'],
                nativeCurrency: {
                  name: 'CFLR',
                  symbol: 'CFLR',
                  decimals: 18
                },
                blockExplorerUrls: ['https://coston-explorer.flare.network']
              }
            ]
          })
        } catch (error) {
          alert((error as any).message)
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
        <StyledLogo src={CostonLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Go to Coston to see if you are eligible!
      </Text>
      <span style={{ padding: '20px' }}></span>
      <Button variant="primary" color="white" height="46px" onClick={switchNetworkCoston}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>GO TO COSTON</span>
      </Button>
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

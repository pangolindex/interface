import React from 'react'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { Text, Button } from '@antiyro/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IChangeChain = {
  changeChain: () => void
}

export const BoxChangeChain: React.FC<IChangeChain> = ({ changeChain }) => {
  const switchNetworkFantom = async () => {
    changeChain()

    let ethereum: any
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2B67' }]
      })
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2B67',
                chainName: 'WAGMI',
                rpcUrls: ['https://api-wagmi.avax-test.network/rpc'],
                nativeCurrency: {
                  name: 'WGM',
                  symbol: 'WGM',
                  decimals: 18
                },
                blockExplorerUrls: ['']
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
        <StyledLogo src={WgmLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Congratulations. You are eligible for the airdrop! Now let&apos;s go crosschain!
      </Text>
      <span style={{ padding: '20px' }}></span>
      <Button variant="primary" color="white" height="46px" onClick={switchNetworkFantom}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>GO TO WAGMI</span>
      </Button>
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

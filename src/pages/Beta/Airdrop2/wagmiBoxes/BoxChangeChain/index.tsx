import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, SmallSeparator, TextBottomWrapper } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IChangeChain = {
  changeChain: () => void
}

export const BoxChangeChain: React.FC<IChangeChain> = ({ changeChain }) => {
  const switchNetworkWagmi = async () => {
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
        } catch (e) {
          // @ts-ignore
          alert(e.message)
        }
      }
    }
  }

  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          You are eligible
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Go to Wagmi to see if you are eligible!
      </Text>
      <SmallSeparator />
      <Button height="46px" color="black" variant="primary" onClick={switchNetworkWagmi}>
        GO TO WAGMI
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </ClaimBox>
  )
}

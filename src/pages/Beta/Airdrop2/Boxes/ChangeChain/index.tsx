import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, SmallSeparator, TextBottomWrapper } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import { Chain } from '@pangolindex/sdk'

type IChangeChain = {
  changeChain: () => void
  chain: Chain
}

interface MetamaskError {
  code: number
  message: string
}

export const BoxChangeChain: React.FC<IChangeChain> = ({ changeChain, chain }) => {
  const switchNetworkWagmi = async () => {
    const { ethereum } = window

    changeChain()
    if (ethereum) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chain?.chain_id?.toString(16)}` }]
        })
      } catch (error) {
        const metamask = error as MetamaskError
        if (metamask.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chain.name,
                chainId: `0x${chain?.chain_id?.toString(16)}`,
                rpcUrls: [chain.rpc_uri],
                blockExplorerUrls: chain.blockExplorerUrls,
                iconUrls: chain.logo,
                nativeCurrency: chain.nativeCurrency
              }
            ]
          })
        }
      }
    }
  }

  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color="text10">
          Change Chain
        </Text>
        <StyledLogo src={chain?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Go to {chain.name} to see if you are eligible!
      </Text>
      <SmallSeparator />
      <Button height="46px" color="black" variant="primary" onClick={switchNetworkWagmi}>
        GO TO {chain.name.toUpperCase()}
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </ClaimBox>
  )
}

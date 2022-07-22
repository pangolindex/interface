import React from 'react'
import { Text } from '@pangolindex/components'
import { ClaimBox, Separator, TitleWrapper, TextBottomWrapper, SmallSeparator, StyledLogo } from '../../styleds'
import { ButtonToConnect } from '../../ButtonToConnect'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'

interface Props {
  chain: Chain
}

export const BoxNotConnected: React.FC<Props> = ({ chain }) => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color="text10">
          Connect Your Wallet
        </Text>
        <StyledLogo src={chain?.logo ?? AVALANCHE_MAINNET?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Let&apos;s check if you are eligible!
      </Text>
      <SmallSeparator />
      <ButtonToConnect />
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </ClaimBox>
  )
}

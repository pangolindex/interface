import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, TextBottomWrapper, SmallSeparator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'

type IclaimPNG = {
  claimPNG: () => void
  amount?: string
  chain: Chain
}

export const BoxClaimReward: React.FC<IclaimPNG> = ({ claimPNG, amount, chain }) => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color="text10">
          Claim Your Reward
        </Text>
        <StyledLogo src={chain?.logo ?? AVALANCHE_MAINNET?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        You are eligible for:
      </Text>
      <Text fontSize={[22, 18]} fontWeight={500} lineHeight="22px" color="text10" textAlign="center">
        {amount}
      </Text>
      <SmallSeparator />
      <Button variant="primary" color="black" height="46px" onClick={claimPNG}>
        CLAIM
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </ClaimBox>
  )
}

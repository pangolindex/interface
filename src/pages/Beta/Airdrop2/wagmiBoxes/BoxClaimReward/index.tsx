import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, TextBottomWrapper, SmallSeparator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IclaimPNG = {
  claimPNG: () => void
  amount?: string
}

export const BoxClaimReward: React.FC<IclaimPNG> = ({ claimPNG, amount }) => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          Claim Your Reward
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        You are eligible for:
      </Text>
      <Text fontSize={22} fontWeight={500} lineHeight="22px" color="text10" textAlign="center">
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

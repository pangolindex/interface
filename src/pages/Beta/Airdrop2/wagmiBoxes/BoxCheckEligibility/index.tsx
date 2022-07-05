import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, SmallSeparator, TextBottomWrapper } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IStatus = {
  checkStatus: () => void
}

export const BoxCheckEligibility: React.FC<IStatus> = ({ checkStatus }) => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color="text10">
          Claim wagmiPNG
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Let&apos;s check if you are eligible!
      </Text>
      <SmallSeparator />
      <Button variant="primary" color="black" height="46px" onClick={checkStatus}>
        CHECK IF ELIGIBLE
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </ClaimBox>
  )
}

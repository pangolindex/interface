import React from 'react'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, SmallSeparator, TextBottomWrapper } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'

type IStatus = {
  checkStatus: () => void
  chain: Chain
}

export const BoxCheckEligibility: React.FC<IStatus> = ({ checkStatus, chain }) => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color="text10">
          Claim {chain?.png_symbol ?? 'PNG'}
        </Text>
        <StyledLogo src={chain?.logo ?? AVALANCHE_MAINNET?.logo} size={'50px'} />
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

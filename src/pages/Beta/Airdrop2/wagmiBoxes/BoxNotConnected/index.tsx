import React from 'react'
import { Text } from '@pangolindex/components'
import { ClaimBox, Separator, TitleWrapper, TextBottomWrapper, SmallSeparator } from '../../styleds'
import { ButtonToConnect } from '../../ButtonToConnect'

export const BoxNotConnected = () => {
  return (
    <ClaimBox>
      <TitleWrapper>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          Claim your rewards
        </Text>
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

import React from 'react'
import { Text } from '@pangolindex/components'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { ButtonToConnect } from '../../ButtonToConnect'
import WgmLogo from 'src/assets/images/wgmlogo.png'

export const BoxNotConnected = () => {
  return (
    <ClaimBox>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          Claim wagmiPNG
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Let&apos;s check if you are eligible!
      </Text>
      <span style={{ padding: '20px' }}></span>
      <ButtonToConnect />
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

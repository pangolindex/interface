import React from 'react'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import CostonLogo from 'src/assets/images/flare.jpeg'


type IStatus = {
  checkStatusCoston: () => void
}

export const BoxCheckEligibilityCoston: React.FC<IStatus> = ({ checkStatusCoston }) => {
  return (
    <ClaimBox>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          Claim costonPNG
        </Text>
        <StyledLogo src={CostonLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Let&apos;s check if you are eligible!
      </Text>
      <span style={{ padding: '20px' }}></span>
      <Button variant="primary" color="white" height="46px" onClick={checkStatusCoston}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>CHECK IF ELIGIBLE</span>
      </Button>
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

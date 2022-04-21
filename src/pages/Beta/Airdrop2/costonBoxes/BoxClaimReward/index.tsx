import React from 'react'
import { ClaimBox, StyledLogo, Separator } from '../../styleds'
import { Text, Button } from '@pangolindex/components'
import CostonLogo from 'src/assets/images/flare.jpeg'

type IclaimPNG = {
  claimPNG: () => void
  amount?: string
}

export const BoxClaimRewardCoston: React.FC<IclaimPNG> = ({ claimPNG, amount }) => {
  return (
    <ClaimBox>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          Claim Your Reward
        </Text>
        <StyledLogo src={CostonLogo} size={'50px'} />
      </span>
      <Separator />
      <span style={{ padding: '20px' }}></span>
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        You are eligible for:
      </Text>
      <Text fontSize={22} fontWeight={500} lineHeight="22px" color="text10" textAlign="center">
        {amount}
      </Text>
      <span style={{ padding: '20px' }}></span>
      <Button variant="primary" color="white" height="46px" onClick={claimPNG}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>CLAIM</span>
      </Button>
      <span style={{ textAlign: 'center' }}>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </span>
    </ClaimBox>
  )
}

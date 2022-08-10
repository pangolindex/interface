import React from 'react'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'
import { Text } from '@pangolindex/components'
import { ClaimBox, StyledLogo, Separator, TitleWrapper, SmallSeparator } from '../../styleds'

interface Props {
  chain: Chain
}

export const BoxCommingSoon: React.FC<Props> = ({ chain }) => {
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
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10" textAlign="center">
        Coming SOON...
      </Text>
      <SmallSeparator />
    </ClaimBox>
  )
}

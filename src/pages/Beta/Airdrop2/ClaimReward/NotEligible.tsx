import React from 'react'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'
import { Button, Text } from '@pangolindex/components'
import { StyledLogo, Separator, TitleWrapper, SmallSeparator, Wrapper, TextBottomWrapper } from '../styleds'
import { switchNetwork } from 'src/utils'

interface Props {
  chain: Chain
}

const NotEligible: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={800} color="text1">
          Try Next One!
        </Text>
        <StyledLogo src={chain?.logo ?? AVALANCHE_MAINNET?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
      <SmallSeparator />
      <Text fontSize={16} fontWeight={500} color="text1" textAlign="center">
        Sadly you are not eligible for this airdrop.
      </Text>
      <SmallSeparator />
      <Button variant="primary" color="black" height="46px" onClick={() => switchNetwork(AVALANCHE_MAINNET)}>
        GO BACK TO AVALANCHE
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          For PNG Holder, Staker and Farmers only...
        </Text>
      </TextBottomWrapper>
    </Wrapper>
  )
}

export default NotEligible

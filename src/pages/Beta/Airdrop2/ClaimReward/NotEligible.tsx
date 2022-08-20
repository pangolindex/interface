import React from 'react'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'
import { Box, Button, Text } from '@pangolindex/components'
import { Wrapper, TextBottomWrapper } from '../styleds'
import { switchNetwork } from 'src/utils'
import Title from '../Title'

interface Props {
  chain: Chain
}

const NotEligible: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <Title chain={chain} title="Try Next One!" />
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="150px">
        <Text fontSize={16} fontWeight={500} color="text1" textAlign="center">
          Sadly you are not eligible for this airdrop.
        </Text>
      </Box>
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

import React from 'react'
import { Chain } from '@pangolindex/sdk'
import { Box, Text } from '@pangolindex/components'
import { Wrapper, TextBottomWrapper } from '../styleds'
import Title from '../Title'

interface Props {
  chain: Chain
}

const NotEligible: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <Title chain={chain} title="Try Next One!" subtitle="Old PSB Reimbursement 1" />
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="150px">
        <Text fontSize={16} fontWeight={500} color="text1" textAlign="center">
          Sadly you are not eligible for this airdrop.
        </Text>
      </Box>

      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          For {chain?.png_symbol ?? 'PNG'} Holder, Staker and Farmers only...
        </Text>
      </TextBottomWrapper>
    </Wrapper>
  )
}

export default NotEligible

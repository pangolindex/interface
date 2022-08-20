import React from 'react'
import { Chain } from '@pangolindex/sdk'
import { Text } from '@pangolindex/components'
import { SmallSeparator, Wrapper } from '../styleds'
import Title from '../Title'

interface Props {
  chain: Chain
}

const CommingSoon: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <Title chain={chain} title={`Claim ${chain?.png_symbol ?? 'PNG'}`} />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10" textAlign="center">
        Coming SOON...
      </Text>
      <SmallSeparator />
    </Wrapper>
  )
}

export default CommingSoon

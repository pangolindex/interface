import React from 'react'
import { Chain } from '@pangolindex/sdk'
import { Box, Text } from '@pangolindex/components'
import { Wrapper } from '../styleds'
import Title from '../Title'

interface Props {
  chain: Chain
}

const CommingSoon: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <Title chain={chain} title={`Claim ${chain?.png_symbol ?? 'PNG'}`} />
      <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1} minWidth="150px">
        <Text fontSize={16} fontWeight={800} lineHeight="18px" color="text10" textAlign="center">
          Coming SOON...
        </Text>
      </Box>
    </Wrapper>
  )
}

export default CommingSoon

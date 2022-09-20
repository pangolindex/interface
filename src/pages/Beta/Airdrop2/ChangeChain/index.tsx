import React from 'react'
import { Wrapper } from '../styleds'
import { Text, Button, Box } from '@pangolindex/components'
import { Chain } from '@pangolindex/sdk'
import { switchNetwork } from 'src/utils'
import Title from '../Title'

interface Props {
  chain: Chain
}

const ChangeChain: React.FC<Props> = ({ chain }) => {
  return (
    <Wrapper>
      <Title chain={chain} title={`Change to ${chain?.name}`} />
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="120px" flex={1}>
        <Text fontSize={16} fontWeight={500} color="text1">
          Go to {chain.name} to see if you are eligible!
        </Text>
      </Box>
      <Button height="46px" color="black" variant="primary" onClick={() => switchNetwork(chain)}>
        GO TO {chain.name.toUpperCase()}
      </Button>
    </Wrapper>
  )
}

export default ChangeChain

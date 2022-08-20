import React from 'react'
import { SmallSeparator, TextBottomWrapper, Wrapper } from '../styleds'
import { Text, Button } from '@pangolindex/components'
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
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Go to {chain.name} to see if you are eligible!
      </Text>
      <SmallSeparator />
      <Button height="46px" color="black" variant="primary" onClick={() => switchNetwork(chain)}>
        GO TO {chain.name.toUpperCase()}
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </Wrapper>
  )
}

export default ChangeChain

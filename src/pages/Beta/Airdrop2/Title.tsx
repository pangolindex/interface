import { Text } from '@pangolindex/components'
import { AVALANCHE_MAINNET, Chain } from '@pangolindex/sdk'
import React from 'react'
import { Colors } from 'src/theme/styled'
import { Separator, StyledLogo, TitleWrapper } from './styleds'

interface Props {
  chain: Chain
  color?: keyof Colors
  title: string
}

const Title: React.FC<Props> = ({ chain, color, title }) => {
  return (
    <>
      <TitleWrapper>
        <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color={color ? color : 'text1'}>
          {title}
        </Text>
        <StyledLogo src={chain?.logo ?? AVALANCHE_MAINNET?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
    </>
  )
}

export default Title

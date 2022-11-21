import { Box, Text } from '@pangolindex/components'
import { AVALANCHE_MAINNET, Chain, ChainId } from '@pangolindex/sdk'
import React from 'react'
import { logoMapping } from 'src/constants/airdrop'
import { Colors } from 'src/theme/styled'
import { Separator, StyledLogo, TitleWrapper } from './styleds'

interface Props {
  chain: Chain
  color?: keyof Colors
  title: string
  subtitle?: string
}

const Title: React.FC<Props> = ({ chain, color, title, subtitle }) => {
  const id = (chain.chain_id as ChainId) ?? (16 as ChainId)
  const logo = logoMapping[id]

  return (
    <>
      <TitleWrapper>
        <Box>
          <Text fontSize={[28, 22]} fontWeight={700} lineHeight="33px" color={color ? color : 'text1'}>
            {title}
          </Text>
          {subtitle && (
            <Text fontSize={[16, 14]} fontWeight={500} color={color ? color : 'text1'}>
              {subtitle}
            </Text>
          )}
        </Box>
        <StyledLogo src={logo || AVALANCHE_MAINNET?.logo} size={'50px'} />
      </TitleWrapper>
      <Separator />
    </>
  )
}

export default Title

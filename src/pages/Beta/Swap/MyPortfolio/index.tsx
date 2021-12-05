import React, { useContext } from 'react'
import { PageWrapper, GridContainer, Divider } from './styleds'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { ChainId, Token } from '@pangolindex/sdk'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'

const MyPortfolio = () => {
  const currency0 = new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
  const currency1 = new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
  const theme = useContext(ThemeContext)
  return (
    <PageWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          Your Portfolio
        </Text>
        <Box bgColor={theme.bg5 as any} p={'5px'}>
          <Plus size={12} color={theme.text1} />
        </Box>
      </Box>
      <GridContainer>
        <Box>Chart</Box>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
              <Text color="text1" fontSize={20} fontWeight={500} marginLeft={10}>
                AVAX
              </Text>
            </Box>

            <Box>
              <Text color="text1" fontSize={16} fontWeight={500} marginLeft={10}>
                $227.05M
              </Text>
            </Box>
          </Box>

          <Divider />

          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
              <Text color="text1" fontSize={20} fontWeight={500} marginLeft={10}>
                AVAX
              </Text>
            </Box>

            <Box>
              <Text color="text1" fontSize={16} fontWeight={500} marginLeft={10}>
                $227.05M
              </Text>
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </PageWrapper>
  )
}
export default MyPortfolio

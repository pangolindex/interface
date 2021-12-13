import React, { useContext } from 'react'
import { PageWrapper, GridContainer } from './styleds'
import { Text, Box, Button } from '@pangolindex/components'
import { ChainId, JSBI, Pair, Token, TokenAmount, WAVAX } from '@pangolindex/sdk'
import { LINK, PNG } from 'src/constants'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'
import PortfolioChart from './PortfolioChart'
import PortfolioRow from './PortfolioRow'
import { useActiveWeb3React } from 'src/hooks'

const MyPortfolio = () => {
  const theme = useContext(ThemeContext)
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()

  const dummyPair = new Pair(
    new TokenAmount(PNG[chainId], JSBI.BigInt(10)),
    new TokenAmount(WAVAX[chainId], JSBI.BigInt(10)),
    chainId
  )
  const data = [PNG[chainId], dummyPair, LINK[chainId]]

  return (
    <PageWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          Your Portfolio
        </Text>
        {/* <Box bgColor={theme.bg5 as any} p={'5px'}>
          <Button variant="primary" backgroundColor="text8" color="text1" width={'32px'} height={'32px'} padding="0px">
            <Plus size={12} color={theme.text1} />
          </Button>
        </Box> */}
      </Box>
      <GridContainer>
        <Box>
          <PortfolioChart />
        </Box>
        <Box>
          {data.map((item, index) => (
            <PortfolioRow
              coin={item instanceof Token ? item : undefined}
              pair={item instanceof Pair ? item : undefined}
              key={index}
            />
          ))}
        </Box>
      </GridContainer>
    </PageWrapper>
  )
}
export default MyPortfolio

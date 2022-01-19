import React from 'react'
import { PageWrapper } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
// import { ChainId, JSBI, Pair, Token, TokenAmount, WAVAX } from '@pangolindex/sdk'
// import { LINK, PNG } from 'src/constants'
// import PortfolioChart from './PortfolioChart'
// import PortfolioRow from './PortfolioRow'
// import { useActiveWeb3React } from 'src/hooks'

const MyPortfolio = () => {
  // const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const { t } = useTranslation()
  // const dummyPair = new Pair(
  //   new TokenAmount(PNG[chainId], JSBI.BigInt(10)),
  //   new TokenAmount(WAVAX[chainId], JSBI.BigInt(10)),
  //   chainId
  // )
  // const data = [PNG[chainId], dummyPair, LINK[chainId]]

  return (
    <PageWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          {t('swapPage.yourPortFolio')}
        </Text>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" pt={80}>
        <Text color="text1" fontSize={32} fontWeight={500}>
          {`${t('swapPage.comingSoon')}...`}
        </Text>
      </Box>
      {/* <GridContainer>
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
      </GridContainer> */}
    </PageWrapper>
  )
}
export default MyPortfolio

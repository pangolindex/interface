import React from 'react'
import { GridContainer, PageWrapper } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import PortfolioChart from './PortfolioChart'
import PortfolioRow from './PortfolioRow'
import { PairDataUser, TokenDataUser, useGetWalletChainTokens } from 'src/state/portifolio/hooks'
import { useActiveWeb3React } from 'src/hooks'

const MyPortfolio = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const data = useGetWalletChainTokens()

  return (
    <PageWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          {t('swapPage.yourPortFolio')}
        </Text>
      </Box>

      {!account ? (
        <Box display="flex" alignItems="center" justifyContent="center" pt={80}>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {`${t('swapPage.connectWalletViewPortFolio')}`}
          </Text>
        </Box>
      ) : (
        <GridContainer>
          <Box>
            <PortfolioChart />
          </Box>
          <Box>
            {data.map((item, index) => (
              <PortfolioRow
                coin={item instanceof TokenDataUser ? item : undefined}
                pair={item instanceof PairDataUser ? item : undefined}
                key={index}
              />
            ))}
          </Box>
        </GridContainer>
      )}

    </PageWrapper>
  )
}
export default MyPortfolio
import React from 'react'
import { GridContainer, PageWrapper } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import PortfolioChart from './PortfolioChart'
import PortfolioRow from './PortfolioRow'
import { PairDataUser, TokenDataUser, useGetWalletChainTokens } from 'src/state/portifolio/hooks'
import { useActiveWeb3React } from 'src/hooks'
import Loader from 'src/components/Loader'

const MyPortfolio = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [data, loading] = useGetWalletChainTokens()

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
          <Box display="flex" alignItems="center">
            {loading ? (
              <Loader
                size="40%"
                stroke="#f5bb00"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block'
                }}
              />
            ) : (
              <Scrollbars>
                {data.map(
                  (item: TokenDataUser | PairDataUser, index) =>
                    item.usdValue >= 1 && (
                      <PortfolioRow
                        coin={item instanceof TokenDataUser ? item : undefined}
                        pair={item instanceof PairDataUser ? item : undefined}
                        key={index}
                      />
                    )
                )}
              </Scrollbars>
            )}
          </Box>
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default MyPortfolio

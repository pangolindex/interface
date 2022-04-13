import React, { useContext, useState } from 'react'
import { GridContainer, PageWrapper, Title, DesktopPortfolioList, MobilePortfolioList } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { PairDataUser, TokenDataUser, useGetWalletChainTokens } from 'src/state/portifolio/hooks'
import { useActiveWeb3React } from 'src/hooks'

import PortfolioChart from './PortfolioChart'
import PortfolioRow from './PortfolioRow'
import Loader from 'src/components/Loader'
import ShowMore from 'src/components/Beta/ShowMore'
import { Hidden } from 'src/theme'

type Props = {
  isLimitOrders: boolean
}

const MyPortfolio: React.FC<Props> = ({ isLimitOrders }) => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false as boolean)

  const { data = [], isLoading } = useGetWalletChainTokens()

  return (
    <PageWrapper>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Title>{t('swapPage.yourPortFolio')}</Title>
      </Box>

      {!account ? (
        <Box display="flex" alignItems="center" justifyContent="center" pt={80}>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {`${t('swapPage.connectWalletViewPortFolio')}`}
          </Text>
        </Box>
      ) : (
        <GridContainer isLimitOrders={isLimitOrders}>
          {!isLimitOrders && (
            <Hidden upToSmall={true}>
              {/* ATTENTION ICI */}
              <PortfolioChart />
            </Hidden>
          )}
          <DesktopPortfolioList>
            {isLoading ? (
              <Loader
                size="40%"
                stroke={theme.yellow3}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block'
                }}
              />
            ) : data.length > 0 ? (
              <Scrollbars>
                {data.map((item: TokenDataUser | PairDataUser, index) => (
                  <PortfolioRow
                    coin={item instanceof TokenDataUser ? item : undefined}
                    pair={item instanceof PairDataUser ? item : undefined}
                    key={index}
                  />
                ))}
              </Scrollbars>
            ) : (
              <Text color="text1">Not found Tokens</Text>
            )}
          </DesktopPortfolioList>

          <MobilePortfolioList>
            {isLoading ? (
              <Loader
                size="40%"
                stroke={theme.yellow3}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block'
                }}
              />
            ) : data.length > 0 ? (
              <>
                {(data || []).slice(0, 3).map((item: TokenDataUser | PairDataUser, index) => (
                  <PortfolioRow
                    coin={item instanceof TokenDataUser ? item : undefined}
                    pair={item instanceof PairDataUser ? item : undefined}
                    key={index}
                  />
                ))}

                {showMore &&
                  (data || [])
                    .slice(3)
                    .map((item: TokenDataUser | PairDataUser, index) => (
                      <PortfolioRow
                        coin={item instanceof TokenDataUser ? item : undefined}
                        pair={item instanceof PairDataUser ? item : undefined}
                        key={index}
                      />
                    ))}

                {data.length > 3 && <ShowMore showMore={showMore} onToggle={() => setShowMore(!showMore)} />}
              </>
            ) : (
              <Text color="text1">Not found Tokens</Text>
            )}
          </MobilePortfolioList>
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default MyPortfolio

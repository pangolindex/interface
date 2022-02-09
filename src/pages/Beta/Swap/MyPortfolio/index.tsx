import React, { useState } from 'react'
import { GridContainer, PageWrapper, HideSmall, Title, DesktopPortfolioList, MobilePortfolioList } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import PortfolioChart from './PortfolioChart'
import PortfolioRow from './PortfolioRow'
import { PairDataUser, TokenDataUser, useGetWalletChainTokens } from 'src/state/portifolio/hooks'
import { useActiveWeb3React } from 'src/hooks'
import Loader from 'src/components/Loader'
import ShowMore from 'src/components/Beta/ShowMore'

type Props = {
  isLimitOrders: boolean
}

const MyPortfolio: React.FC<Props> = ({ isLimitOrders }) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false as boolean)
  const [data, loading] = useGetWalletChainTokens()

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
            <HideSmall>
              <PortfolioChart />
            </HideSmall>
          )}
          <DesktopPortfolioList>
            {loading ? (
              <Loader
                size="40%"
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
          </DesktopPortfolioList>

          <MobilePortfolioList>
            {loading ? (
              <Loader
                size="40%"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block'
                }}
              />
            ) : (
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
            )}
          </MobilePortfolioList>
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default MyPortfolio

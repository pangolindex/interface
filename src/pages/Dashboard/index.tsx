import React from 'react'
import { PageTitle, PageDescription, PageWrapper, TopContainer, StatsWrapper } from './styleds'
import { useTranslation } from 'react-i18next'
import { NewsWidget, WatchList, RedirectContext } from '@pangolindex/components'
import PortfolioWidget from './Portfolio'
import { ChainId, CHAINS } from '@pangolindex/sdk'
import { useActiveWeb3React } from 'src/hooks'
import { Hidden, Visible } from 'src/theme'

const Dashboard = () => {
  const { t } = useTranslation()
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>

      <TopContainer>
        <StatsWrapper>
          <PortfolioWidget />
          {CHAINS[chainId].mainnet && (
            <RedirectContext.Provider value={true}>
              <WatchList />
            </RedirectContext.Provider>
          )}
        </StatsWrapper>

        <Hidden upToSmall={true}>
          <NewsWidget boxHeight="400px" />
        </Hidden>
      </TopContainer>

      <Visible upToSmall={true}>
        <NewsWidget boxHeight="400px" />
      </Visible>
    </PageWrapper>
  )
}

export default Dashboard

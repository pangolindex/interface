import React from 'react'
import { PageTitle, PageDescription, PageWrapper, TopContainer, StatsWrapper } from './styleds'
import { useTranslation } from 'react-i18next'
import { RedirectContext } from '../Beta/Swap/WatchList/CoinChart'
import WatchList from '../Beta/Swap/WatchList'
import NewsWidget from './News'
import PortfolioWidget from './Portfolio'
import { ChainId, CHAINS } from '@pangolindex/sdk'
import { useActiveWeb3React } from 'src/hooks'
import { Hidden, Visible } from 'src/theme'
//import Earned from './Earned'
//import FollowedWallet from './FollowWallet'

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
          <NewsWidget />
        </Hidden>
      </TopContainer>

      <Visible upToSmall={true}>
        <NewsWidget />
      </Visible>
    </PageWrapper>
  )
}

export default Dashboard

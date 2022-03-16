import React from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  PortfolioWrapper,
  WatchListWrapper
} from './styleds'

import { useTranslation } from 'react-i18next'

import { RedirectContext } from '../Beta/Swap/WatchList/CoinChart'
import WatchList from '../Beta/Swap/WatchList'
import NewsWidget from './News'
import PortfolioWidget from './Portfolio'
import MyPortfolio from '../Beta/Swap/MyPortfolio'
//import Earned from './Earned'
//import FollowedWallet from './FollowWallet'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <NewsWidget />
        <PortfolioWrapper>
          <PortfolioWidget />
          <MyPortfolio isLimitOrders={false} />
        </PortfolioWrapper>
        <RedirectContext.Provider value={true}>
          <WatchListWrapper>
            <WatchList />
          </WatchListWrapper>
        </RedirectContext.Provider>
      </TopContainerWrapper>
    </PageWrapper>
  )
}

export default Dashboard

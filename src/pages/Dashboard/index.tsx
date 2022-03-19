import React from 'react'
import {
  /*   PageTitle,
    PageDescription, */
  PageWrapper,
  LegacyButtonWrapper,
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
import { Button } from '@pangolindex/components'
//import Earned from './Earned'
//import FollowedWallet from './FollowWallet'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      {/*       <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription> */}
      <LegacyButtonWrapper>
        <Button variant="primary" height={36} width="max-content" padding="4px 6px" target="_self" href="/#" as="a">
          <span style={{ whiteSpace: 'nowrap', color: '#000' }}>{t('header.returnToLegacySite')}</span>
        </Button>
      </LegacyButtonWrapper>
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

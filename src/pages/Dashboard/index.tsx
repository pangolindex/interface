import React from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  BottomContainerWrapper,
  ContainerLeft,
  ContainerRight
} from './styleds'

import { useTranslation } from 'react-i18next'

import { RedirectContext } from '../Beta/Swap/WatchList/CoinChart'
import WatchList from '../Beta/Swap/WatchList'
import NewsWidget from './News'
import PortfolioWidget from './Portfolio'
//import Earned from './Earned'
//import FollowedWallet from './FollowWallet'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <ContainerLeft>
          <TopContainerWrapper>
            <PortfolioWidget />
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <RedirectContext.Provider value={true}>
              <WatchList />
            </RedirectContext.Provider>
          </BottomContainerWrapper>
        </ContainerLeft>
        <ContainerRight>
          <NewsWidget />
        </ContainerRight>
      </TopContainerWrapper>
    </PageWrapper>
  )
}

export default Dashboard

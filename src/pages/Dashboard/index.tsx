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
import { CHAINS } from 'src/constants/chains'
import { ChainId } from '@pangolindex/sdk'
import { useActiveWeb3React } from 'src/hooks'
//import Earned from './Earned'
//import FollowedWallet from './FollowWallet'

const Dashboard = () => {
  const { t } = useTranslation()
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()

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
            {CHAINS[chainId].is_mainnet && (
              <RedirectContext.Provider value={true}>
                <WatchList />
              </RedirectContext.Provider>
            )}
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

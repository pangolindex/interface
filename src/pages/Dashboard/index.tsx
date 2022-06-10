import React from 'react'
import { PageTitle, PageDescription, PageWrapper, TopContainer, StatsWrapper } from './styleds'
import { useTranslation } from 'react-i18next'
import { NewsWidget, WatchList, Portifolio } from '@pangolindex/components'
import { ChainId, CHAINS } from '@pangolindex/sdk'
import { useActiveWeb3React } from 'src/hooks'
import { Hidden, Visible } from 'src/theme'
import { BETA_MENU_LINK } from 'src/constants'

const Dashboard = () => {
  const { t } = useTranslation()
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>

      <TopContainer>
        <StatsWrapper>
          <Portifolio />
          {CHAINS[chainId].mainnet && (
            <WatchList visibleTradeButton={true} tradeLinkUrl={BETA_MENU_LINK.swap} redirect={true} />
          )}
        </StatsWrapper>

        <Hidden upToSmall={true}>
          <NewsWidget boxHeight="450px" />
        </Hidden>
      </TopContainer>

      <Visible upToSmall={true}>
        <NewsWidget boxHeight="450px" />
      </Visible>
    </PageWrapper>
  )
}

export default Dashboard

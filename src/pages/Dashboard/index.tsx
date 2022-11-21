import React from 'react'
import { PageTitle, PageDescription, PageWrapper, TopContainer, StatsWrapper } from './styleds'
import { NewsWidget, WatchList, Portfolio, useTranslation } from '@pangolindex/components'
import { CHAINS } from '@pangolindex/sdk'
import { useChainId } from 'src/hooks'
import { Hidden, Visible } from 'src/theme'
import { MENU_LINK } from 'src/constants'
import { WATCHLIST_ACCESS } from 'src/constants/accessPermissions'

const Dashboard = () => {
  const { t } = useTranslation()
  const chainId = useChainId()
  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>

      <TopContainer>
        {CHAINS[chainId]?.mainnet && (
          <StatsWrapper>
            <Portfolio />

            {WATCHLIST_ACCESS[chainId] && (
              <WatchList visibleTradeButton={true} tradeLinkUrl={MENU_LINK.swap} redirect={true} />
            )}
          </StatsWrapper>
        )}

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

import React from 'react'
import { PageTitle, PageDescription, PageWrapper, TopContainer, StatsWrapper } from './styleds'
import { useTranslation } from '@honeycomb-finance/shared'
import { WatchList, Portfolio } from '@honeycomb-finance/portfolio'
import { NewsWidget } from '@honeycomb-finance/core'
import { CHAINS } from '@pangolindex/sdk'
import { useChainId } from 'src/hooks'
import { Hidden, Visible } from 'src/theme'

const Dashboard = () => {
  const { t } = useTranslation()
  const chainId = useChainId()

  const isMainnet = CHAINS[chainId]?.mainnet

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>

      <TopContainer isMainnet={isMainnet}>
        {isMainnet && (
          <StatsWrapper>
            <Portfolio />
            <WatchList />
          </StatsWrapper>
        )}

        <Hidden upToSmall={true}>
          <NewsWidget boxHeight={isMainnet ? '100%' : '450px'} />
        </Hidden>
      </TopContainer>

      <Visible upToSmall={true}>
        <NewsWidget boxHeight="450px" />
      </Visible>
    </PageWrapper>
  )
}

export default Dashboard

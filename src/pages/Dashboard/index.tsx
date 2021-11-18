import React from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  BottomContainerWrapper,
  Card,
  CardHeader
} from './styleds'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <Card>
          <CardHeader>{t('dashboardPage.portfolioValue')}</CardHeader>
        </Card>
        <div>
          <TopContainerWrapper>
            <Card>
              <CardHeader>News</CardHeader>
            </Card>
            <Card>
              <CardHeader>{t('dashboardPage.earned')}</CardHeader>
            </Card>
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <Card>
              <CardHeader>{t('dashboardPage.coins')}</CardHeader>
            </Card>
          </BottomContainerWrapper>
        </div>
      </TopContainerWrapper>
      <BottomContainerWrapper>
        <Card>
          <CardHeader>{t('dashboardPage.followedWallets')}</CardHeader>
        </Card>
      </BottomContainerWrapper>
    </PageWrapper>
  )
}

export default Dashboard

import React from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  BottomContainerWrapper,
  Card,
  CardHeader,
  CardBody
} from './styleds'
import { useTranslation } from 'react-i18next'
import TradingViewChart from './TradingViewChart'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <Card>
          <CardHeader>{t('dashboardPage.portfolioValue')}</CardHeader>
          <CardBody>
            <TradingViewChart />
          </CardBody>
        </Card>
        <div>
          <TopContainerWrapper>
            <Card>
              <CardHeader>News</CardHeader>
            </Card>
            <Card>
              <CardHeader>{t('dashboardPage.earned')}</CardHeader>
              <CardBody>
                {t('dashboardPage.earned_dailyIncome')}
                {t('dashboardPage.earned_totalEarned')}
              </CardBody>
            </Card>
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <Card>
              <CardHeader>{t('dashboardPage.coins')}</CardHeader>
              <CardBody></CardBody>
            </Card>
          </BottomContainerWrapper>
        </div>
      </TopContainerWrapper>
      <BottomContainerWrapper>
        <Card>
          <CardHeader>{t('dashboardPage.followedWallets')}</CardHeader>
          <CardBody></CardBody>
        </Card>
      </BottomContainerWrapper>
    </PageWrapper>
  )
}

export default Dashboard

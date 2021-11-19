import React, { useState } from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  BottomContainerWrapper,
  Card,
  CardHeader,
  CardBody,
  Label,
  Value,
  FlexWrapper
} from './styleds'
import { useTranslation } from 'react-i18next'
import { Button } from '@pangolindex/components'
import TradingViewChart from './TradingViewChart'
import PngToggle from './PngToggle'

const Dashboard = () => {
  const { t } = useTranslation()

  const [earnedCurrency, setEarnedCurrency] = useState<boolean>(false)
  const handleEarnedCurrency = (currency: boolean) => {
    setEarnedCurrency(currency)
  }

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
              <CardHeader>
                <div>{t('dashboardPage.earned')}</div>
                <PngToggle isActive={earnedCurrency} toggle={handleEarnedCurrency} />
              </CardHeader>
              <CardBody>
                <Label>{t('dashboardPage.earned_dailyIncome')}</Label>
                <Value>2.400021</Value>
                <Label>{t('dashboardPage.earned_totalEarned')}</Label>
                <Value>2.400021</Value>
                <FlexWrapper>
                  <Button variant="primary">xStake</Button>
                  <Button variant="primary">{t('dashboardPage.earned_claim')}</Button>
                </FlexWrapper>
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

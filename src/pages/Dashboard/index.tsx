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
  FlexWrapper,
  ContainerLeft,
  ContainerRight,
  ClaimButton,
  XStakeButton,
  CustomizePools,
} from './styleds'
import { useTranslation } from 'react-i18next'
import TradingViewChart from './TradingViewChart'
import PngToggle from './PngToggle'
import { Link } from 'react-router-dom'

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
        <ContainerLeft>
          <Card>
            <CardHeader>{t('dashboardPage.portfolioValue')}</CardHeader>
            <CardBody>
              <TradingViewChart />
            </CardBody>
          </Card>
        </ContainerLeft>
        <ContainerRight>
          <TopContainerWrapper>
            <Card>
              <CardHeader>News</CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div>{t('dashboardPage.earned')}</div>
                <PngToggle isActive={earnedCurrency} toggle={handleEarnedCurrency} leftLabel="USD" rightLabel="PNG" />
              </CardHeader>
              <CardBody>
                <Label>{t('dashboardPage.earned_dailyIncome')}</Label>
                <Value>2.400021</Value>
                <Label>{t('dashboardPage.earned_totalEarned')}</Label>
                <Value>2.400021</Value>
                <FlexWrapper>
                  <XStakeButton variant="primary">xStake</XStakeButton>
                  <ClaimButton variant="primary">{t('dashboardPage.earned_claim')}</ClaimButton>
                </FlexWrapper>
                <CustomizePools>
                  <Link to="/">Customize Pools</Link>
                </CustomizePools>
              </CardBody>
            </Card>
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <Card>
              <CardHeader>{t('dashboardPage.coins')}</CardHeader>
              <CardBody></CardBody>
            </Card>
          </BottomContainerWrapper>
        </ContainerRight>
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

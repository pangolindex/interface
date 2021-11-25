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
  ValueWithInfo,
  FlexWrapper,
  ContainerLeft,
  ContainerRight,
  ClaimButton,
  XStakeButton,
  CustomizePools,
  AddNewCoinButton,
  TokenChart,
  TokenList
} from './styleds'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import TradingViewChart from './TradingViewChart'
import PngToggle from './PngToggle'
import TokenRow from './TokenRow'

import { useDarkModeManager } from '../../state/user/hooks'
import Logo from '../../assets/svg/icon.svg'
import LogoDark from '../../assets/svg/icon.svg'
import Info from '../../assets/svg/info.svg'

const Dashboard = () => {
  const { t } = useTranslation()

  const [earnedCurrency, setEarnedCurrency] = useState<boolean>(false)
  const handleEarnedCurrency = (currency: boolean) => {
    setEarnedCurrency(currency)
  }

  const [isDark] = useDarkModeManager()

  const data = []

  const rand = 300
  for (let i = 0; i < 20; i += 1) {
    const d = {
      key: 2000 + i,
      value: Math.random() * (rand + 50) + 100
    }

    data.push(d)
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
                <Value>
                  2.400021 <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
                </Value>
                <Label>{t('dashboardPage.earned_totalEarned')}</Label>
                <ValueWithInfo>
                  <Value>
                    2.400021 <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
                  </Value>
                  <img width={'24px'} src={Info} alt="logo" />
                </ValueWithInfo>
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
              <CardHeader>
                {t('dashboardPage.coins')}
                <AddNewCoinButton>
                  + <span>Add New Coin</span>
                </AddNewCoinButton>
              </CardHeader>
              <CardBody>
                <FlexWrapper>
                  <TokenChart></TokenChart>
                  <TokenList>
                    <TokenRow />
                    <TokenRow name="AVAX" />
                    <TokenRow name="ETH.e" />
                    <TokenRow name="LINK.e" />
                    <TokenRow name="USDT.e" />
                    <TokenRow name="XAVA" />
                  </TokenList>
                </FlexWrapper>
              </CardBody>
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

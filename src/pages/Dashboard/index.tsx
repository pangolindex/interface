import React, { useState /*, useRef*/ } from 'react'
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
  DateRangeSelect,
  DateRangeItem,
  TokenList,
  NewsSection,
  NewsTitle,
  NewsContent,
  NewsDate,
  SlickNext
} from './styleds'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LineChart, Line } from 'recharts'
import Slider from 'react-slick'
import { ArrowRight } from 'react-feather'

import TradingViewChart from './TradingViewChart'
import PngToggle from './PngToggle'
import TokenRow from './TokenRow'

import { useDarkModeManager } from '../../state/user/hooks'
import Logo from '../../assets/svg/icon.svg'
import LogoDark from '../../assets/svg/icon.svg'
import Info from '../../assets/svg/info.svg'
import Earth from '../../assets/images/earth.png'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const NewsFeedSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
}

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

  const [coinsToken, setCoinsToken] = useState<string>('PNG')
  const handleToken = (tokenName: string) => {
    console.log(tokenName)
    setCoinsToken(tokenName)
  }

  // let sliderRef = useRef()
  const handleNewsNext = () => {
    // sliderRef.current.slickNext()
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
            <ContainerLeft>
              <NewsSection img={Earth}>
                <NewsTitle>News</NewsTitle>
                <SlickNext onClick={handleNewsNext}>
                  <ArrowRight size={20} style={{ minWidth: 24 }} />
                </SlickNext>
                <Slider /*ref={sliderRef}*/ {...NewsFeedSettings}>
                  <div>
                    <NewsContent>
                      AVAX has been forming a harmonic pattern, and currently retracing a major Fibonacci level.
                    </NewsContent>
                    <NewsDate>7:00 PM IST, 14-OCT-21</NewsDate>
                  </div>
                  <div>
                    <NewsContent>
                      AVAX has been forming a harmonic pattern, and currently retracing a major Fibonacci level.
                    </NewsContent>
                    <NewsDate>7:00 PM IST, 14-OCT-21</NewsDate>
                  </div>
                  <div>
                    <NewsContent>
                      AVAX has been forming a harmonic pattern, and currently retracing a major Fibonacci level.
                    </NewsContent>
                    <NewsDate>7:00 PM IST, 14-OCT-21</NewsDate>
                  </div>
                </Slider>
              </NewsSection>
            </ContainerLeft>
            <ContainerRight>
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
            </ContainerRight>
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <Card style={{ paddingRight: '0px' }}>
              <CardHeader style={{ paddingRight: '30px' }}>
                {t('dashboardPage.coins')}
                <AddNewCoinButton>
                  + <span>Add New Coin</span>
                </AddNewCoinButton>
              </CardHeader>
              <CardBody>
                <FlexWrapper>
                  <TokenChart>
                    <LineChart width={380} height={200} data={data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={coinsToken === 'PNG' ? '#18C145' : '#E84142'}
                        dot={false}
                      />
                    </LineChart>
                    <DateRangeSelect>
                      <DateRangeItem>1H</DateRangeItem>
                      <DateRangeItem className="active">1D</DateRangeItem>
                      <DateRangeItem>1W</DateRangeItem>
                      <DateRangeItem>1M</DateRangeItem>
                      <DateRangeItem>1Y</DateRangeItem>
                      <DateRangeItem>ALL</DateRangeItem>
                    </DateRangeSelect>
                  </TokenChart>
                  <TokenList>
                    <TokenRow onClick={() => handleToken('PNG')} />
                    <TokenRow name="AVAX" onClick={() => handleToken('AVAX')} />
                    <TokenRow name="ETH.e" diffPercent={-1.5} onClick={() => handleToken('ETH')} />
                    <TokenRow name="LINK.e" onClick={() => handleToken('LINK.e')} />
                    <TokenRow name="USDT.e" onClick={() => handleToken('USDT.e')} />
                    <TokenRow name="XAVA" onClick={() => handleToken('XAVA')} />
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

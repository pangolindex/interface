import React, { useState, useRef } from 'react'
import {
  PageTitle,
  PageDescription,
  PageWrapper,
  TopContainerWrapper,
  BottomContainerWrapper,
  Card,
  CardHeader,
  CardBody,
  FlexWrapper,
  // Portfolio
  PortfolioToken,
  PortfolioTokenPercent,
  PortfolioInfo,
  HeaderDropdowns,
  // Earned
  Label,
  Value,
  ValueWithInfo,
  ContainerLeft,
  ContainerRight,
  ClaimButton,
  XStakeButton,
  CustomizePools,
  // Tokens
  AddNewCoinButton,
  TokenChart,
  DateRangeSelect,
  DateRangeItem,
  TokenList,
  CoinDetail,
  CoinDetailToken,
  // News
  NewsSection,
  NewsTitle,
  NewsContent,
  NewsDate,
  SlickNext,
  // Followed Wallets
  WalletProfile,
  WalletProfileAddress,
  WalletProfileChain,
  WalletTokens,
  WalletAddresses,
  Row,
  FollowButton,
  IconButton,
  ContainerLeftFollowed
} from './styleds'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LineChart, Line } from 'recharts'
import Slider, { Settings } from 'react-slick'
import { ArrowRight } from 'react-feather'
import Linkify from 'react-linkify';
import makeBlockie from 'ethereum-blockies-base64'

import TradingViewChart from './TradingViewChart'
import PngToggle from './PngToggle'
import TokenRow from './TokenRow'
import ChainDropdown from './ChainDropdown'

import { useDarkModeManager } from 'src/state/user/hooks'
import Logo from 'src/assets/images/logo.png'
import LogoDark from 'src/assets/images/logo.png'
import Info from 'src/assets/svg/info.svg'
import Info2 from 'src/assets/svg/info2.svg'
import LinkIcon from 'src/assets/svg/link.svg'
import DeleteIcon from 'src/assets/svg/delete.svg'
import Earth from 'src/assets/images/earth.png'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { CHAIN, CHAINS, ChainsId } from 'src/constants/chains'
import { useGetChainsBalances } from 'src/state/portifolio/hooks'
import { News, useGetNews } from 'src/state/news/hooks'

const NewsFeedSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
}

enum DateRangeType {
  hour = '1H',
  day = '1D',
  week = '1W',
  month = '1M',
  year = '1Y',
  all = 'ALL'
}

const Dashboard = () => {
  const { t } = useTranslation()
  const [isDark] = useDarkModeManager()

  // earned
  const [earnedCurrency, setEarnedCurrency] = useState<boolean>(false)
  const handleEarnedCurrency = (currency: boolean) => {
    setEarnedCurrency(currency)
  }

  // coins
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

  const [tokenDateRange, setTokenDateRange] = useState<string>('1D')
  const handleTokenDateRange = (dateRange: string) => {
    setTokenDateRange(dateRange)
  }

  // news
  const sliderRef = useRef<Slider | null>(null)
  const handleNewsNext = () => {
    sliderRef?.current?.slickNext()
  }
  const news = useGetNews()

  // portifolio
  const [selectChain, setSelectChain] = useState<CHAIN>(CHAINS[ChainsId.All])
  const handleSelectChain = (newChain: CHAIN) => {
    setSelectChain(newChain)
  }
  const balances = useGetChainsBalances()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <ContainerLeft>
          <Card>
            <CardHeader>
              {t('dashboardPage.portfolioValue') + " in " + selectChain.name}
              <HeaderDropdowns>
                <ChainDropdown selectChain={selectChain} handleSelectChain={handleSelectChain}></ChainDropdown>
              </HeaderDropdowns>
            </CardHeader>
            <CardBody>
              <TradingViewChart />
              <PortfolioToken>
                ${
                  !!balances[ChainsId[selectChain.symbol as keyof typeof ChainsId]]
                    ? balances[ChainsId[selectChain.symbol as keyof typeof ChainsId]].toLocaleString(
                      undefined, 
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : 0
                }
                <img width={'50px'} src={selectChain.logo} alt={'Chain logo'} style={{ marginLeft: '12px' }} />
                <PortfolioTokenPercent>23.3%</PortfolioTokenPercent>
              </PortfolioToken>
              <PortfolioInfo>
                <img width={'24px'} src={Info2} alt="i" /> &nbsp;&nbsp;Includes coin, pools, and unclaimed rewards worth
                in current wallet
              </PortfolioInfo>
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
                <Slider ref={sliderRef} {...NewsFeedSettings}>
                  {
                    news && news.map((element: News) => {
                      return (
                        <div key={element.id}>
                          <NewsContent>
                            <Linkify>{element?.content}</Linkify>
                          </NewsContent>
                          <NewsDate>{element?.publishedAt.toLocaleTimeString()}, {element?.publishedAt.toLocaleDateString()}</NewsDate>
                        </div>
                      )
                    })
                  }
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
                    <CoinDetail>
                      <CoinDetailToken>
                        <img width={'56px'} src={Logo} alt={'token'} />
                        <div>
                          <div className="token">Avax</div>
                          <div className="price">122.74$</div>
                        </div>
                      </CoinDetailToken>
                      <div className="buttons">
                        <IconButton variant="secondary">
                          <img width={'15px'} src={LinkIcon} alt="link" />
                        </IconButton>
                        <FollowButton variant="primary" follow={true}>
                          Trade
                        </FollowButton>
                      </div>
                    </CoinDetail>
                    <LineChart width={380} height={200} data={data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={coinsToken === 'PNG' ? '#18C145' : '#E84142'}
                        dot={false}
                      />
                    </LineChart>
                    <DateRangeSelect>
                      {Object.values(DateRangeType).map((dateValue: string) => (
                        <DateRangeItem
                          key={dateValue}
                          className={tokenDateRange === dateValue ? 'active' : ''}
                          onClick={() => handleTokenDateRange(dateValue)}
                        >
                          {dateValue}
                        </DateRangeItem>
                      ))}
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
          <CardHeader>
            {t('dashboardPage.followedWallets')}
            <AddNewCoinButton style={{ width: '200px' }}>
              + <span>Add New Address</span>
            </AddNewCoinButton>
          </CardHeader>
          <CardBody>
            <FlexWrapper>
              <ContainerLeftFollowed>
                <WalletProfile>
                  <img
                    width={56}
                    src={makeBlockie('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8')}
                    style={{ marginRight: '12px' }}
                    alt="0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"
                  />
                  <div>
                    <WalletProfileAddress>0x372E6…A63B4</WalletProfileAddress>
                    <WalletProfileChain>C-Chain Wallet</WalletProfileChain>
                  </div>
                </WalletProfile>
                <WalletTokens>
                  <Row type="th">
                    <div>Type</div>
                    <div>Name</div>
                    <div>Worth</div>
                  </Row>
                  <Row>
                    <div>Coin</div>
                    <div>Avax</div>
                    <div>207,542$</div>
                  </Row>
                  <Row>
                    <div>Coin</div>
                    <div>Avax</div>
                    <div>207,542$</div>
                  </Row>
                  <Row>
                    <div>Coin</div>
                    <div>Avax</div>
                    <div>207,542$</div>
                  </Row>
                </WalletTokens>
              </ContainerLeftFollowed>
              <ContainerRight>
                <WalletAddresses>
                  <Row type="th">
                    <div>Address</div>
                    <div>Worth</div>
                    <div>Interact</div>
                  </Row>
                  <Row>
                    <div>0x372E6…A63B4</div>
                    <div>251,235.25$</div>
                    <FlexWrapper>
                      <FollowButton variant="primary" follow={false}>
                        Unfollow
                      </FollowButton>
                      <IconButton variant="secondary">
                        <img width={'15px'} src={DeleteIcon} alt="delete" />
                      </IconButton>
                    </FlexWrapper>
                  </Row>
                  <Row>
                    <div>0x372E6…A63B4</div>
                    <div>251,235.25$</div>
                    <FlexWrapper>
                      <FollowButton variant="primary" follow={true}>
                        Follow
                      </FollowButton>
                      <IconButton variant="secondary">
                        <img width={'15px'} src={DeleteIcon} alt="delete" />
                      </IconButton>
                    </FlexWrapper>
                  </Row>
                  <Row>
                    <div>0x372E6…A63B4</div>
                    <div>251,235.25$</div>
                    <FlexWrapper>
                      <FollowButton variant="primary" follow={false}>
                        Unfollow
                      </FollowButton>
                      <IconButton variant="secondary">
                        <img width={'15px'} src={DeleteIcon} alt="delete" />
                      </IconButton>
                    </FlexWrapper>
                  </Row>
                </WalletAddresses>
              </ContainerRight>
            </FlexWrapper>
          </CardBody>
        </Card>
      </BottomContainerWrapper>
    </PageWrapper>
  )
}

export default Dashboard
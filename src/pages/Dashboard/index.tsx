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
  //FlexWrapper,
  // Portfolio
  PortfolioToken,
  PortfolioInfo,
  HeaderDropdowns,
  // Earned
  // Label,
  // Value,
  // ValueWithInfo,
  ContainerLeft,
  ContainerRight,
  // ClaimButton,
  // XStakeButton,
  // CustomizePools,
  // Tokens
  //AddNewCoinButton,
  // News
  NewsSection,
  NewsTitle,
  NewsContent,
  NewsDate,
  SlickNext,
  // Followed Wallets
  // WalletProfile,
  // WalletProfileAddress,
  // WalletProfileChain,
  // WalletTokens,
  // WalletAddresses,
  // Row,
  // FollowButton,
  // IconButton,
  // ContainerLeftFollowed
} from './styleds'
import { useTranslation } from 'react-i18next'
//import { Link } from 'react-router-dom'
import Slider, { Settings } from 'react-slick'
import { ArrowRight } from 'react-feather'
//import makeBlockie from 'ethereum-blockies-base64'
import ReactMarkdown from 'react-markdown'

//import TradingViewChart from './TradingViewChart'
//import PngToggle from './PngToggle'
import ChainDropdown from './ChainDropdown'

//import { useDarkModeManager } from 'src/state/user/hooks'
// import Logo from 'src/assets/images/logo.png'
// import LogoDark from 'src/assets/images/logo.png'
// import Info from 'src/assets/svg/info.svg'
import Info2 from 'src/assets/svg/info2.svg'
//import DeleteIcon from 'src/assets/svg/delete.svg'
import Earth from 'src/assets/images/earth.png'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { CHAIN, CHAINS, ChainsId } from 'src/constants/chains'
import { useGetChainsBalances } from 'src/state/portifolio/hooks'
import { News, useGetNews } from 'src/state/news/hooks'
import WatchList from '../Beta/Swap/WatchList'
import { RedirectContext } from '../Beta/Swap/WatchList/CoinChart'

const NewsFeedSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
}

const Dashboard = () => {
  const { t } = useTranslation()
  // const [isDark] = useDarkModeManager()

  // // earned
  // const [earnedCurrency, setEarnedCurrency] = useState<boolean>(false)
  // const handleEarnedCurrency = (currency: boolean) => {
  //   setEarnedCurrency(currency)
  // }

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

  // news
  const sliderRef = useRef<Slider | null>(null)
  const handleNewsNext = () => {
    sliderRef?.current?.slickNext()
  }
  const news = useGetNews()
  window.setInterval(handleNewsNext, 10000);

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
          <TopContainerWrapper>
            <Card>
              <CardHeader>
                {t('dashboardPage.portfolioValue') + ' in ' + selectChain.name}
                <HeaderDropdowns>
                  <ChainDropdown selectChain={selectChain} handleSelectChain={handleSelectChain}></ChainDropdown>
                </HeaderDropdowns>
              </CardHeader>
              <CardBody>
                {/* <TradingViewChart /> */}
                <PortfolioToken>
                  $
                  {!!balances[ChainsId[selectChain.symbol as keyof typeof ChainsId]]
                    ? balances[ChainsId[selectChain.symbol as keyof typeof ChainsId]].toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                    : 0}
                  <img width={'50px'} src={selectChain.logo} alt={'Chain logo'} style={{ marginLeft: '12px' }} />
                  {/* <PortfolioTokenPercent>23.3%</PortfolioTokenPercent> */}
                </PortfolioToken>
                <PortfolioInfo>
                  <img width={'24px'} src={Info2} alt="i" /> &nbsp;&nbsp;Includes coin, pools, and unclaimed rewards worth
                  in current wallet
                </PortfolioInfo>
              </CardBody>
            </Card>
          </TopContainerWrapper>
          <BottomContainerWrapper>
            <RedirectContext.Provider value={true}>
              <WatchList />
            </RedirectContext.Provider>
          </BottomContainerWrapper>
        </ContainerLeft>
        <ContainerRight>
          <NewsSection img={Earth}>
            <NewsTitle>News</NewsTitle>
            <SlickNext onClick={handleNewsNext}>
              <ArrowRight size={20} style={{ minWidth: 24 }} />
            </SlickNext>
            <Slider ref={sliderRef} {...NewsFeedSettings}>
              {news &&
                news.map((element: News) => {
                  return (
                    <div key={element.id}>
                      <NewsContent>
                        <ReactMarkdown>{element?.content}</ReactMarkdown>
                      </NewsContent>
                      <NewsDate>
                        {element?.publishedAt.toLocaleTimeString()}, {element?.publishedAt.toLocaleDateString()}
                      </NewsDate>
                    </div>
                  )
                })}
            </Slider>
          </NewsSection>
          {/* EARNED WIDGET */}
          {/* <ContainerRight>
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
            </ContainerRight> */}
        </ContainerRight>
      </TopContainerWrapper>
      {/* <BottomContainerWrapper>
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
      </BottomContainerWrapper> */}
    </PageWrapper>
  )
}

export default Dashboard

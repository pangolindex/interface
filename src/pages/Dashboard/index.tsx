import React, { useRef } from 'react'
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
  //HeaderDropdowns,
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
  SlickNext
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
import { Box, Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
//import { Link } from 'react-router-dom'
import Slider, { Settings } from 'react-slick'
import { ArrowLeft, ArrowRight } from 'react-feather'
//import makeBlockie from 'ethereum-blockies-base64'
import ReactMarkdown from 'react-markdown'
import Scrollbars from 'react-custom-scrollbars'

//import TradingViewChart from './TradingViewChart'
//import PngToggle from './PngToggle'
//import ChainDropdown from './ChainDropdown'

//import { useDarkModeManager } from 'src/state/user/hooks'
// import Logo from 'src/assets/images/logo.png'
// import LogoDark from 'src/assets/images/logo.png'
// import Info from 'src/assets/svg/info.svg'
import Info2 from 'src/assets/svg/info2.svg'
//import DeleteIcon from 'src/assets/svg/delete.svg'
import Earth from 'src/assets/images/earth.png'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { CHAINS, ChainsId } from 'src/constants/chains'
import { useGetChainsBalances } from 'src/state/portifolio/hooks'
import { News, useGetNews } from 'src/state/news/hooks'
import WatchList from '../Beta/Swap/WatchList'
import { RedirectContext } from '../Beta/Swap/WatchList/CoinChart'
import { useActiveWeb3React } from 'src/hooks'
import Loader from 'src/components/Loader'

const NewsFeedSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000
}

const Dashboard = () => {
  const { t } = useTranslation()
  // const [isDark] = useDarkModeManager()

  const { account } = useActiveWeb3React()

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
  const handleNewsBack = () => {
    sliderRef?.current?.slickPrev()
  }
  const news = useGetNews()

  // portifolio
  // const [selectChain, setSelectChain] = useState<CHAIN>(CHAINS[ChainsId.All])
  // const handleSelectChain = (newChain: CHAIN) => {
  //   setSelectChain(newChain)
  // }
  const [balances, loading] = useGetChainsBalances()

  return (
    <PageWrapper>
      <PageTitle>{t('dashboardPage.dashboard')}</PageTitle>
      <PageDescription>{t('dashboardPage.greetings')}</PageDescription>
      <TopContainerWrapper>
        <ContainerLeft>
          <TopContainerWrapper>
            <Card>
              <CardHeader>
                {t('dashboardPage.portfolioValue') + ' in All Chains'}
                {/* <HeaderDropdowns>
                  <ChainDropdown selectChain={selectChain} handleSelectChain={handleSelectChain}></ChainDropdown>
                </HeaderDropdowns> */}
              </CardHeader>
              <CardBody>
                {/* <TradingViewChart /> */}
                {!!account ? (
                  loading ? (
                    <Loader
                      size="10%"
                      stroke="#f5bb00"
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <Scrollbars style={{ height: 190 }}>
                      {Object.keys(ChainsId).map(
                        (key, index) =>
                          isNaN(parseInt(key)) &&
                          key !== 'All' &&
                          !!balances[ChainsId[key as keyof typeof ChainsId]] &&
                          balances[ChainsId[key as keyof typeof ChainsId]] >= 1 && (
                            <PortfolioToken key={index} height={50}>
                              $
                              {!!balances[ChainsId[key as keyof typeof ChainsId]]
                                ? balances[ChainsId[key as keyof typeof ChainsId]].toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })
                                : 0}
                              <img
                                width={'50px'}
                                src={CHAINS[ChainsId[key as keyof typeof ChainsId]].logo}
                                alt={'Chain logo'}
                                style={{ marginLeft: '12px' }}
                              />
                            </PortfolioToken>
                          )
                      )}
                    </Scrollbars>
                  )
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Text color="text1" fontSize={24} fontWeight={500}>
                      {`${t('swapPage.connectWalletViewPortFolio')}`}
                    </Text>
                  </Box>
                )}
                <PortfolioInfo>
                  <img width={'24px'} src={Info2} alt="i" /> &nbsp;&nbsp;Includes coin, pools, and unclaimed rewards
                  worth in current wallet
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
            <SlickNext onClick={handleNewsBack} style={{ right: 60 }}>
              <ArrowLeft size={20} style={{ minWidth: 24 }} />
            </SlickNext>
            <SlickNext onClick={handleNewsNext}>
              <ArrowRight size={20} style={{ minWidth: 24 }} />
            </SlickNext>
            {!!news ? (
              <Slider ref={sliderRef} {...NewsFeedSettings}>
                {news &&
                  news.map((element: News) => {
                    return (
                      <div key={element.id}>
                        <NewsContent>
                          <ReactMarkdown
                            renderers={{
                              link: props => (
                                <a href={props.href} rel="nofollow noreferrer noopener" target="_blank">
                                  {props.children}
                                </a>
                              )
                            }}
                          >
                            {element?.content}
                          </ReactMarkdown>
                        </NewsContent>
                        <NewsDate>
                          {element?.publishedAt.toLocaleTimeString()}, {element?.publishedAt.toLocaleDateString()}
                        </NewsDate>
                      </div>
                    )
                  })}
              </Slider>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Loader
                  size="10%"
                  stroke="#f5bb00"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block'
                  }}
                />
              </Box>
    
            )}
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
                    <XStakeButton variant="outline">xStake</XStakeButton>
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
                      <FollowButton variant="primary" follow={false} height="24px">
                        Unfollow
                      </FollowButton>
                      <IconButton variant="secondary">
                        <img width={'15px'} src={DeleteIcon} alt="delete" height="24px" />
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

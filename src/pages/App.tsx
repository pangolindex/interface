import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { MENU_LINK } from 'src/constants'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import { useChainId } from 'src/hooks'
import { VOTE_PAGE_ACCESS } from 'src/constants/accessPermissions'
const Polling = React.lazy(() => import('../components/Header/Polling'))
const Popups = React.lazy(() => import('../components/Popups'))
const Web3ReactManager = React.lazy(() => import('../components/Web3ReactManager'))
const DarkModeQueryParamReader = React.lazy(() => import('../theme/DarkModeQueryParamReader'))
const Dashboard = React.lazy(() => import('./Dashboard'))
const MigrateV2 = React.lazy(() => import('./Migrate'))
const CustomRoute = React.lazy(() => import('./Route'))
const Layout = React.lazy(() => import('../layout'))
const SwapV2 = React.lazy(() => import('./Beta/Swap'))
const StakeV2 = React.lazy(() => import('./Beta/Stake'))
const GovernanceV2 = React.lazy(() => import('./Beta/Governance'))
const GovernanceDetailV2 = React.lazy(() => import('./Beta/GovernanceDetail'))
const BuyV2 = React.lazy(() => import('./Beta/Buy'))
const PoolV2 = React.lazy(() => import('./Beta/Pool'))
const BridgeV2 = React.lazy(() => import('./Beta/Bridge'))
const AirdropV2 = React.lazy(() => import('./Beta/Airdrop2'))
const Policy = React.lazy(() => import('./Beta/Policy'))
const SarStake = React.lazy(() => import('./SarStake'))

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 0px;
  align-items: unset;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: 100vh;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px;
    padding-top:  0px; 
  `};

  z-index: 1;
`

export default function App() {
  const chainId = useChainId()
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <CustomRoute exact path={`${MENU_LINK.dashboard}`} component={Dashboard} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.migrate}/:version`} component={MigrateV2} layout={Layout} />

              <CustomRoute exact path={`${MENU_LINK.swap}`} component={SwapV2} layout={Layout} />
              <CustomRoute exact strict path={`${MENU_LINK.stake}/:version`} component={StakeV2} layout={Layout} />
              {/* <CustomRoute
                exact
                strict
                path="/beta/stake/:version/:rewardCurrencyId"
                component={ManageStakeV2}
                layout={Layout}
              /> */}
              {VOTE_PAGE_ACCESS[chainId] && (
                <>
                  <CustomRoute exact path={`${MENU_LINK.vote}`} component={GovernanceV2} layout={Layout} />
                  <CustomRoute
                    exact
                    strict
                    path={`${MENU_LINK.vote}/:id`}
                    component={GovernanceDetailV2}
                    layout={Layout}
                  />
                </>
              )}

              <CustomRoute exact strict path={`${MENU_LINK.buy}`} component={BuyV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.pool}`} component={PoolV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.bridge}`} component={BridgeV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.airdrop}`} component={AirdropV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.stakev2}`} component={SarStake} layout={Layout} />

              {/* <Route exact path="/beta/migrate/:version" component={MigrateV2} /> */}

              <CustomRoute exact path="/policy/privacy" component={() => <Policy policy="privacy" />} layout={Layout} />
              <CustomRoute exact path="/policy/cookie" component={() => <Policy policy="cookie" />} layout={Layout} />
              <CustomRoute exact path="/policy/terms" component={() => <Policy policy="terms" />} layout={Layout} />

              {/* <Route component={RedirectPathToSwapOnly} /> */}
              <Redirect to={MENU_LINK.dashboard} />
            </Switch>
          </Web3ReactManager>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}

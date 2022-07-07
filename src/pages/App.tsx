import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { MENU_LINK } from 'src/constants'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Dashboard from './Dashboard'
// import { RedirectPathToSwapOnly } from './Swap/redirects'
import Migrate from './Earn/Migrate'
import MigrateV2 from './Migrate'
import CustomRoute from './Route'
import Layout from '../layout'
import SwapV2 from './Beta/Swap'
import StakeV2 from './Beta/Stake'
import GovernanceV2 from './Beta/Governance'
import GovernanceDetailV2 from './Beta/GovernanceDetail'
import BuyV2 from './Beta/Buy'
import PoolV2 from './Beta/Pool'
import BridgeV2 from './Beta/Bridge'
import AirdropV2 from './Beta/Airdrop2'
import Policy from './Beta/Policy'

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
              <Route
                exact
                path="/migrate/:currencyIdFromA/:currencyIdFromB/:versionFrom/:currencyIdToA/:currencyIdToB/:versionTo/"
                component={Migrate}
              />

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
              <CustomRoute exact path={`${MENU_LINK.vote}`} component={GovernanceV2} layout={Layout} />
              <CustomRoute exact strict path={`${MENU_LINK.vote}/:id`} component={GovernanceDetailV2} layout={Layout} />
              <CustomRoute exact strict path={`${MENU_LINK.buy}`} component={BuyV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.pool}`} component={PoolV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.bridge}`} component={BridgeV2} layout={Layout} />
              <CustomRoute exact path={`${MENU_LINK.airdrop}`} component={AirdropV2} layout={Layout} />

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

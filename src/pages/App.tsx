import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'
import { shouldHideMenuItem } from 'src/utils'
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

interface IRoute {
  menuLink?: MENU_LINK //Bring it blank if it is same with path
  path: string | MENU_LINK
  component: React.FC
  layout: React.FC
  strict?: boolean
  exact?: boolean
}

export default function App() {
  const chainId = useChainId()
  const routes: IRoute[] = [
    {
      path: MENU_LINK.dashboard,
      component: Dashboard,
      layout: Layout
    },
    {
      menuLink: MENU_LINK.migrate,
      path: `${MENU_LINK.migrate}/:version`,
      component: MigrateV2,
      layout: Layout
    },
    {
      path: MENU_LINK.swap,
      component: SwapV2,
      layout: Layout
    },
    {
      menuLink: MENU_LINK.stake,
      path: `${MENU_LINK.stake}/:version`,
      strict: true,
      component: StakeV2,
      layout: Layout
    },
    {
      path: MENU_LINK.vote,
      strict: true,
      component: GovernanceV2,
      layout: Layout
    },
    {
      menuLink: MENU_LINK.vote,
      path: `${MENU_LINK.vote}/:id`,
      strict: true,
      component: GovernanceDetailV2,
      layout: Layout
    },
    {
      path: MENU_LINK.pool,
      component: PoolV2,
      layout: Layout
    },
    {
      path: `${MENU_LINK.buy}/:type`,
      strict: true,
      component: BuyV2,
      layout: Layout
    },
    {
      path: MENU_LINK.bridge,
      component: BridgeV2,
      layout: Layout
    },
    {
      path: MENU_LINK.airdrop,
      component: AirdropV2,
      layout: Layout
    },
    {
      path: MENU_LINK.stakev2,
      component: SarStake,
      layout: Layout
    }
  ]

  return (
    <Suspense fallback={null}>
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              {routes.map(
                (route, i) =>
                  !shouldHideMenuItem(chainId, route?.menuLink || (route.path as MENU_LINK)) && (
                    <CustomRoute
                      key={i}
                      exact
                      strict={route?.strict}
                      path={route.path}
                      component={route.component}
                      layout={route.layout}
                    />
                  )
              )}
              {/* <CustomRoute
                exact
                strict
                path="/beta/stake/:version/:rewardCurrencyId"
                component={ManageStakeV2}
                layout={Layout}
              /> */}

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

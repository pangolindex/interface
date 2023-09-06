import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'
import { shouldHideMenuItem } from 'src/utils'
import Web3ReactManager from 'src/components/Web3ReactManager'

const Polling = React.lazy(() => import('../components/Header/Polling'))
const Popups = React.lazy(() => import('../components/Popups'))
const Dashboard = React.lazy(() => import('./Dashboard'))
const MigrateV2 = React.lazy(() => import('./Migrate'))
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
}

export default function App() {
  const chainId = useChainId()
  const routes: IRoute[] = [
    {
      path: MENU_LINK.dashboard,
      component: Dashboard
    },
    {
      menuLink: MENU_LINK.migrate,
      path: `${MENU_LINK.migrate}/:version`,
      component: MigrateV2
    },
    {
      path: MENU_LINK.swap,
      component: SwapV2
    },
    {
      menuLink: MENU_LINK.stake,
      path: `${MENU_LINK.stake}/:version`,
      component: StakeV2
    },
    {
      path: MENU_LINK.vote,
      component: GovernanceV2
    },
    {
      menuLink: MENU_LINK.vote,
      path: `${MENU_LINK.vote}/:id`,
      component: GovernanceDetailV2
    },
    {
      path: `${MENU_LINK.pool}/:type`,
      component: PoolV2
    },
    {
      path: `${MENU_LINK.buy}/:type`,
      component: BuyV2
    },
    {
      path: MENU_LINK.bridge,
      component: BridgeV2
    },
    {
      path: `${MENU_LINK.airdrop}/:type`,
      component: AirdropV2
    },
    {
      path: MENU_LINK.stakev2,
      component: SarStake
    }
  ]

  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* render all dynamic routes */}
                {routes
                  .filter(route => !shouldHideMenuItem(chainId, route?.menuLink || (route.path as MENU_LINK)))
                  .map((route, i) => {
                    const Component = route.component
                    return <Route key={i} path={route.path} element={<Component />} />
                  })}

                <Route index element={<Dashboard />} />
                <Route path="policy/privacy" element={<Policy policy="privacy" />} />
                <Route path="policy/cookie" element={<Policy policy="cookie" />} />
                <Route path="policy/terms" element={<Policy policy="terms" />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>
          </Web3ReactManager>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}

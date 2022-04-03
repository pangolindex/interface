import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import { EarnV1, EarnV2, ManageV1, ManageV2 } from './Earn'
// import ManageEarn from './Earn/Manage'
import Stake from './Stake'
import ManageStake from './Stake/Manage'
import Pool from './Pool'
import Buy from './Buy'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Dashboard from './Dashboard'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Airdrop from './Airdrop'

import Vote from './Vote'
import VotePage from './Vote/VotePage'

import IDO from './IDO'
import Migrate from './Earn/Migrate'

import MigrateV2 from './Migrate'
import { useIsBetaUI } from '../hooks/useLocation'
import CustomRoute from './Route'
import Layout from '../layout'

import SwapV2 from './Beta/Swap'
import StakeV2 from './Beta/Stake'

import GovernanceV2 from './Beta/Governance'
import GovernanceDetailV2 from './Beta/GovernanceDetail'
import BuyV2 from './Beta/Buy'
import PoolV2 from './Beta/Pool'
import AirdropV2 from './Beta/Airdrop2'
import { BETA_MENU_LINK } from 'src/constants'

import Policy from './Beta/Policy'




import Transfer from './Beta/Bridge/components/Transfer'
import Attest from "src/pages/Beta/Bridge/components/Attest";
import Migration from "src/pages/Beta/Bridge/components/Migration";
import EvmQuickMigrate from "src/pages/Beta/Bridge/components/Migration/EvmQuickMigrate";
import SolanaQuickMigrate from "src/pages/Beta/Bridge/components/Migration/SolanaQuickMigrate";
import NFT from "src/pages/Beta/Bridge/components/NFT";
import NFTOriginVerifier from "src/pages/Beta/Bridge/components/NFTOriginVerifier";
// import Recovery from "src/pages/Beta/Bridge/components/Recovery";
import Stats from "src/pages/Beta/Bridge/components/Stats";
import TokenOriginVerifier from "src/pages/Beta/Bridge/components/TokenOriginVerifier";
import WithdrawTokensTerra from "src/pages/Beta/Bridge/components/WithdrawTokensTerra";

import {
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
} from "@certusone/wormhole-sdk";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div<{ isBeta: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top:  ${({ isBeta }) => (isBeta ? '0px' : '100px')}; 
  align-items: ${({ isBeta }) => (isBeta ? 'unset' : 'center')};
  // padding: ${({ isBeta }) => (isBeta ? '50px' : undefined)};
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: 100vh;

  ${({ theme, isBeta }) => theme.mediaWidth.upToSmall`
    padding: ${isBeta ? '0px' : '16px'};
    padding-top: ${isBeta ? '0px' : '2rem'}; 
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const isBeta = useIsBetaUI()

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        {!isBeta && (
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
        )}

        <BodyWrapper isBeta={isBeta}>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/buy" component={Buy} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/png/2" component={EarnV2} />
              <Route exact strict path="/png/:version" component={EarnV1} />
              <Route exact strict path="/stake/:version" component={Stake} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/ido" component={IDO} />
              <Route exact strict path="/airdrop" component={Airdrop} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

              <Route exact strict path="/png/:currencyIdA/:currencyIdB/2" component={ManageV2} />
              <Route exact strict path="/png/:currencyIdA/:currencyIdB/:version" component={ManageV1} />

              <Route exact strict path="/stake/:version/:rewardCurrencyId" component={ManageStake} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route
                exact
                path="/migrate/:currencyIdFromA/:currencyIdFromB/:versionFrom/:currencyIdToA/:currencyIdToB/:versionTo/"
                component={Migrate}
              />

              <CustomRoute exact path={`${BETA_MENU_LINK.dashboard}`} component={Dashboard} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.migrate}/:version`} component={MigrateV2} layout={Layout} />

              <CustomRoute exact path={`${BETA_MENU_LINK.swap}`} component={SwapV2} layout={Layout} />
              <CustomRoute exact strict path={`${BETA_MENU_LINK.stake}/:version`} component={StakeV2} layout={Layout} />
              {/* <CustomRoute
                exact
                strict
                path="/beta/stake/:version/:rewardCurrencyId"
                component={ManageStakeV2}
                layout={Layout}
              /> */}
              <CustomRoute exact path={`${BETA_MENU_LINK.vote}`} component={GovernanceV2} layout={Layout} />
              <CustomRoute
                exact
                strict
                path={`${BETA_MENU_LINK.vote}/:id`}
                component={GovernanceDetailV2}
                layout={Layout}
              />
              <CustomRoute exact strict path={`${BETA_MENU_LINK.buy}`} component={BuyV2} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.pool}`} component={PoolV2} layout={Layout} />
              <CustomRoute exact strict path={`${BETA_MENU_LINK.airdrop}`} component={AirdropV2} layout={Layout} />

              {/* <Route exact path="/beta/migrate/:version" component={MigrateV2} /> */}

              <CustomRoute
                exact
                path="/beta/policy/privacy"
                component={() => <Policy policy="privacy" />}
                layout={Layout}
                />
              <CustomRoute
                exact
                path="/beta/policy/cookie"
                component={() => <Policy policy="cookie" />}
                layout={Layout}
                />
              <CustomRoute
                exact
                path="/beta/policy/terms"
                component={() => <Policy policy="terms" />}
                layout={Layout}
                />

              <CustomRoute exact path={`${BETA_MENU_LINK.transfer}`} component={Transfer} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.NFT}`} component={NFT} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.attest}`} component={Attest} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.NFTOriginVerifier}`} component={NFTOriginVerifier} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.TokenOriginVerifier}`} component={TokenOriginVerifier} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.stats}`} component={Stats} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.SolanaQuickMigrate}`} component={SolanaQuickMigrate} layout={Layout} />
              <CustomRoute exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}`} component={WithdrawTokensTerra} layout={Layout} />
              
              <Route exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}/Solana/:legacyAsset/:fromTokenAccount`}>
                <Migration chainId={CHAIN_ID_SOLANA} />
              </Route>
              <Route exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}/Ethereum/:legacyAsset/`}>
                <Migration chainId={CHAIN_ID_ETH} />
              </Route>
              <Route exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}/BinanceSmartChain/:legacyAsset/`}>
                <Migration chainId={CHAIN_ID_BSC} />
              </Route>
              <Route exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}/Ethereum/`}>
                <EvmQuickMigrate chainId={CHAIN_ID_ETH} />
              </Route>
              <Route exact path={`${BETA_MENU_LINK.WithdrawTokensTerra}/BinanceSmartChain/`}>
                <EvmQuickMigrate chainId={CHAIN_ID_BSC} />
              </Route>
              <Route component={RedirectPathToSwapOnly} />

            </Switch>
          </Web3ReactManager>
          {!isBeta && <Marginer />}
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}


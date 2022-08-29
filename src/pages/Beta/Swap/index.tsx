import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper, SwapWidgetWrapper } from './styleds'
import { MyPortfolio, SwapWidget, WatchList } from '@pangolindex/components'
import PairInfo from './PairInfo'
import LimitOrderList from './LimitOrderList'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'
import ComingSoon from 'src/components/Beta/ComingSoon'
import { useGelatoLimitOrdersHook } from 'src/state/swap/multiChainsHooks'
import {
  LIMITORDERLIST_ACCESS,
  MYPORTFOLIO_ACCESS,
  WATCHLIST_ACCESS,
  PAIRINFO_ACCESS
} from 'src/constants/accessPermissions'

const SwapUI = () => {
  const chainId = useChainId()
  const useGelatoLimitOrders = useGelatoLimitOrdersHook[chainId]
  const { allOrders } = useGelatoLimitOrders()

  const isLimitOrders = (allOrders || []).length > 0

  const isOnlySwapWidget =
    !PAIRINFO_ACCESS[chainId] &&
    !LIMITORDERLIST_ACCESS[chainId] &&
    !MYPORTFOLIO_ACCESS[chainId] &&
    !WATCHLIST_ACCESS[chainId]

  const getSwapPageInfo = () => {
    if (isOnlySwapWidget) {
      return (
        <SwapWidgetWrapper>
          <SwapWidget isLimitOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_gelato} />
        </SwapWidgetWrapper>
      )
    } else {
      return (
        <>
          <TopContainer>
            <StatsWrapper>{PAIRINFO_ACCESS[chainId] ? <PairInfo /> : <ComingSoon />}</StatsWrapper>
            <SwapWidget isLimitOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_gelato} />
          </TopContainer>

          {CHAINS[chainId]?.mainnet &&
            (LIMITORDERLIST_ACCESS[chainId] || MYPORTFOLIO_ACCESS[chainId] || WATCHLIST_ACCESS[chainId]) && (
              <GridContainer isLimitOrders={isLimitOrders}>
                {isLimitOrders && LIMITORDERLIST_ACCESS[chainId] && <LimitOrderList />}
                {MYPORTFOLIO_ACCESS[chainId] && <MyPortfolio />}
                {WATCHLIST_ACCESS[chainId] && <WatchList coinChartVisible={!isLimitOrders} />}
              </GridContainer>
            )}
        </>
      )
    }
  }

  return <PageWrapper>{getSwapPageInfo()}</PageWrapper>
}
export default SwapUI

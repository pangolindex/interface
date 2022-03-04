import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairInfo from './PairInfo'
import SwapWidget from './SwapWidget'
import { RedirectContext } from './WatchList/CoinChart'
import LimitOrderList from './LimitOrderList'
import { useGelatoLimitOrderList } from 'src/state/swap/hooks'

const SwapUI = () => {
  const { allOrders } = useGelatoLimitOrderList()

  const isLimitOrders = (allOrders || []).length > 0
  return (
    <PageWrapper>
      <TopContainer>
        <StatsWrapper>
          <PairInfo />
        </StatsWrapper>
        <SwapWidget />
      </TopContainer>

      <GridContainer isLimitOrders={isLimitOrders}>
        {isLimitOrders && <LimitOrderList />}

        <MyPortfolio isLimitOrders={isLimitOrders} />
        <RedirectContext.Provider value={false}>
          <WatchList isLimitOrders={isLimitOrders} />
        </RedirectContext.Provider>
      </GridContainer>
    </PageWrapper>
  )
}
export default SwapUI

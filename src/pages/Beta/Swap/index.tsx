import React from 'react'
import { PageWrapper, PairInfoWrapper, TopContainer } from './styleds'
/* import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList' */
import PairInfo from './PairInfo'
import SwapWidget from './SwapWidget'
/* import { RedirectContext } from './WatchList/CoinChart' */
import LimitOrderList from './LimitOrderList'
import { useGelatoLimitOrderList } from 'src/state/swap/hooks'

const SwapUI = () => {
  const { allOrders } = useGelatoLimitOrderList()

  const isLimitOrders = (allOrders || []).length > 0
  return (
    <PageWrapper>
      <TopContainer>
        <SwapWidget />
        <PairInfoWrapper>
          <PairInfo />
        </PairInfoWrapper>
        {isLimitOrders && <LimitOrderList />}
        {/* </TopContainer> */}

        {/* <GridContainer isLimitOrders={isLimitOrders}> */}

        {/* <MyPortfolio isLimitOrders={isLimitOrders} />
        <RedirectContext.Provider value={false}>
          <WatchList isLimitOrders={isLimitOrders} />
        </RedirectContext.Provider>
        </GridContainer> */}
      </TopContainer>
    </PageWrapper>
  )
}
export default SwapUI

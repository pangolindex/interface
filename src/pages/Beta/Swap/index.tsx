import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import { useGelatoLimitOrderList, SwapWidget } from '@pangolindex/components'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairInfo from './PairInfo'
import { RedirectContext } from './WatchList/CoinChart'
import LimitOrderList from './LimitOrderList'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'

const SwapUI = () => {
  const { allOrders } = useGelatoLimitOrderList()
  const chainId = useChainId()

  const isLimitOrders = (allOrders || []).length > 0
  return (
    <PageWrapper>
      <TopContainer>
        <StatsWrapper>
          <PairInfo />
        </StatsWrapper>
        <SwapWidget isLimitOrderVisible={CHAINS[chainId].mainnet} />
      </TopContainer>

      {CHAINS[chainId].mainnet && (
        <GridContainer isLimitOrders={isLimitOrders}>
          {isLimitOrders && <LimitOrderList />}
          <MyPortfolio isLimitOrders={isLimitOrders} />
          <RedirectContext.Provider value={false}>
            <WatchList isLimitOrders={isLimitOrders} />
          </RedirectContext.Provider>
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default SwapUI

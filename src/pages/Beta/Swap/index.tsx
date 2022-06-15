import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import { useGelatoLimitOrderList, MyPortfolio, SwapWidget, WatchList } from '@pangolindex/components'
import PairInfo from './PairInfo'
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
          <MyPortfolio/>
          <WatchList coinChartVisible={!isLimitOrders} />
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default SwapUI

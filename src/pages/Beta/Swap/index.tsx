import React from 'react'
import { PageWrapper, TopContainer, StatsWrapper, GridContainer } from './styleds'
import { SwapWidget, WatchList, useGelatoLimitOrderList } from '@pangolindex/components'
import MyPortfolio from './MyPortfolio'
import PairInfo from './PairInfo'
import LimitOrderList from './LimitOrderList'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'
import { isEvmChain } from 'src/utils'
import ComingSoon from 'src/components/Beta/ComingSoon'

const SwapUI = () => {
  const { allOrders } = useGelatoLimitOrderList()
  const chainId = useChainId()

  const isLimitOrders = (allOrders || []).length > 0
  return (
    <PageWrapper>
      <TopContainer>
        <StatsWrapper>{isEvmChain(chainId) ? <PairInfo /> : <ComingSoon />}</StatsWrapper>
        <SwapWidget isLimitOrderVisible={CHAINS[chainId]?.mainnet} />
      </TopContainer>

      {CHAINS[chainId]?.mainnet && isEvmChain(chainId) && (
        <GridContainer isLimitOrders={isLimitOrders}>
          {isLimitOrders && <LimitOrderList />}
          <MyPortfolio isLimitOrders={isLimitOrders} />
          <WatchList coinChartVisible={!isLimitOrders} />
        </GridContainer>
      )}
    </PageWrapper>
  )
}
export default SwapUI

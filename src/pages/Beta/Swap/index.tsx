import React from 'react'
import { PageWrapper, ChartWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairStat from './PairStat'
import Swap from './Swap'

const SwapUI = () => {
  return (
    <PageWrapper>
      <TopContainer>
        <StatsWrapper>
          <PairStat />
          <ChartWrapper>Chart</ChartWrapper>
        </StatsWrapper>
        <Swap />
      </TopContainer>
      <GridContainer>
        <MyPortfolio />
        <WatchList />
      </GridContainer>
    </PageWrapper>
  )
}
export default SwapUI

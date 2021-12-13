import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairStat from './PairStat'
import SwapWidget from './SwapWidget'
import PairChart from './PairChart'

const SwapUI = () => {
  return (
    <PageWrapper>
      <TopContainer>
        <StatsWrapper>
          <PairStat />
          <PairChart />
        </StatsWrapper>
        <SwapWidget />
      </TopContainer>
      <GridContainer>
        <MyPortfolio />
        <WatchList />
      </GridContainer>
    </PageWrapper>
  )
}
export default SwapUI

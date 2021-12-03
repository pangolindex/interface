import React from 'react'
import { PageWrapper, ChartWrapper, GridContainer } from './styleds'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairStat from './PairStat'
import Swap from './Swap'

const SwapUI = () => {
  return (
    <PageWrapper>
      <GridContainer>
        <PairStat />
        <Swap />
        <ChartWrapper>Chart</ChartWrapper>
      </GridContainer>
      <GridContainer>
        <MyPortfolio />
        <WatchList />
      </GridContainer>
    </PageWrapper>
  )
}
export default SwapUI

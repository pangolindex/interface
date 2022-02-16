import React from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper } from './styleds'
import MyPortfolio from './MyPortfolio'
import WatchList from './WatchList'
import PairInfo from './PairInfo'
import SwapWidget from './SwapWidget'
import { RedirectContext } from './WatchList/CoinChart'
import LimitOrderList from './LimitOrderList'
import { useGelatoLimitOrderList } from 'src/state/swap/hooks'
import { Tooltip } from '@mui/material'
import { useActiveWeb3React } from 'src/hooks'

import { ChainId } from '@antiyro/sdk'
const SwapUI = () => {
  const { allOrders } = useGelatoLimitOrderList()
  const { chainId } = useActiveWeb3React()

  const isLimitOrders = (allOrders || []).length > 0
  return (
    <PageWrapper>
      <TopContainer>
        {chainId === ChainId.WAGMI ? (
        <Tooltip title="Not supported on this Chain" followCursor>
          <StatsWrapper>
            <PairInfo />
          </StatsWrapper>
        </Tooltip>
        ) : (
          <StatsWrapper>
            <PairInfo />
          </StatsWrapper>
        )}
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

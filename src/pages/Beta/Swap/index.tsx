import React, { useState } from 'react'
import { PageWrapper, GridContainer, TopContainer, StatsWrapper, GridWrapper } from './styleds'
import { MyPortfolio, SwapWidget, WatchList, SwapTypes, useGelatoLimitOrdersListHook } from '@pangolindex/components'
import PairInfo from './PairInfo'
import LimitOrderList from './LimitOrderList'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'
import ComingSoon from 'src/components/Beta/ComingSoon'
import { LIMITORDERLIST_ACCESS, MYPORTFOLIO_ACCESS, PAIRINFO_ACCESS } from 'src/constants/accessPermissions'
import { Hidden, Visible } from 'src/theme'

const SwapUI = () => {
  const chainId = useChainId()
  const useGelatoLimitOrders = useGelatoLimitOrdersListHook[chainId]
  const { allOrders } = useGelatoLimitOrders()
  const [swapType, onSwapTypeChange] = useState(SwapTypes.MARKET)
  const isLimitOrders = (allOrders || []).length > 0 && swapType === SwapTypes.LIMIT

  const isOnlySwapWidget = !PAIRINFO_ACCESS[chainId] && !LIMITORDERLIST_ACCESS[chainId] && !MYPORTFOLIO_ACCESS[chainId]

  const getSwapPageInfo = () => {
    if (isOnlySwapWidget) {
      return (
        <GridWrapper>
          <Hidden upToSmall={true}>
            <WatchList coinChartVisible={true} />
          </Hidden>
          <SwapWidget
            isTWAPOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_twap}
            onSwapTypeChange={onSwapTypeChange}
            isLimitOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_gelato}
          />
          <Visible upToSmall={true} upToMedium={false}>
            <WatchList coinChartVisible={true} />
          </Visible>
        </GridWrapper>
      )
    } else {
      return (
        <>
          <TopContainer>
            <StatsWrapper>{PAIRINFO_ACCESS[chainId] ? <PairInfo /> : <ComingSoon />}</StatsWrapper>
            <SwapWidget
              isTWAPOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_twap}
              onSwapTypeChange={onSwapTypeChange}
              isLimitOrderVisible={CHAINS[chainId]?.mainnet && CHAINS[chainId]?.supported_by_gelato}
            />
          </TopContainer>

          {CHAINS[chainId]?.mainnet && (
            <GridContainer isLimitOrders={isLimitOrders}>
              {isLimitOrders && LIMITORDERLIST_ACCESS[chainId] && <LimitOrderList />}
              {MYPORTFOLIO_ACCESS[chainId] && <MyPortfolio />}
              <WatchList coinChartVisible={!isLimitOrders} />
            </GridContainer>
          )}
        </>
      )
    }
  }

  return <PageWrapper>{getSwapPageInfo()}</PageWrapper>
}
export default SwapUI

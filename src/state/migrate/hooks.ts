import { useMemo, useState, useEffect } from 'react'
import { ChainId, Pair } from '@antiyro/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalancesWithLoadingIndicator } from '../wallet/hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../user/hooks'
import { StakingInfo } from '../stake/hooks'
import { useGetStakingDataWithAPR, useMinichefPools } from '../../state/stake/hooks'

export interface selectedPoolState {
  selectedPool: { [address: string]: { pair: Pair; staking?: StakingInfo | undefined } }
}

export function useGetUserLP() {
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map(tokens => ({
        liquidityToken: toV2LiquidityToken(tokens, chainId ? chainId : ChainId.AVALANCHE),
        tokens
      })),
    [trackedTokenPairs, chainId]
  )

  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  //fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  //const liquidityTokensWithBalances = tokenPairsWithLiquidityTokens

  const lpTokensWithBalances = useMemo(() => liquidityTokensWithBalances.map(({ tokens }) => tokens), [
    liquidityTokensWithBalances
  ])
  const v2Pairs = usePairs(lpTokensWithBalances)

  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = useMemo(
    () => v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair)),
    [v2Pairs]
  )

  const pairWithLpTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens), [
    tokenPairsWithLiquidityTokens
  ])
  const v2AllPairs = usePairs(pairWithLpTokens)

  const allV2AllPairsWithLiquidity = useMemo(
    () => v2AllPairs.map(([, pair]) => pair).filter((v2AllPairs): v2AllPairs is Pair => Boolean(v2AllPairs)),
    [v2AllPairs]
  )

  return useMemo(() => ({ v2IsLoading, allV2PairsWithLiquidity, allPairs: allV2AllPairsWithLiquidity }), [
    v2IsLoading,
    allV2PairsWithLiquidity,
    allV2AllPairsWithLiquidity
  ])
}

export function useGetMigrationData(version: number) {
  let { v2IsLoading, allV2PairsWithLiquidity, allPairs } = useGetUserLP()

  const [allPool, setAllPool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })

  const stakingInfos = useGetStakingDataWithAPR(Number(version))

  const poolMap = useMinichefPools()

  useEffect(() => {
    let pairs = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }

    for (let index = 0; index < stakingInfos.length; index++) {
      const stakingInfo = stakingInfos[index]

      let pairAddress = stakingInfo?.stakedAmount?.token?.address
      let stakingData = stakingInfo

      let pair = allPairs.find(
        data => data?.liquidityToken?.address === stakingData?.stakedAmount?.token?.address
      ) as Pair

      if (stakingData?.stakedAmount.greaterThan('0') && poolMap.hasOwnProperty(pairAddress)) {
        pairs[pairAddress] = {
          pair: pair,
          staking: stakingData
        }
      }
    }

    setAllPool(pairs)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(stakingInfos || []).length])

  return useMemo(
    () => ({ allPool, v2IsLoading: v2IsLoading || stakingInfos.length === 0, allV2PairsWithLiquidity, allPairs }),
    [allPool, v2IsLoading, stakingInfos, allV2PairsWithLiquidity, allPairs]
  )
}

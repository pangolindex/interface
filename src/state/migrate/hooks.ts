import { useMemo, useState, useEffect } from 'react'
import { ChainId, Pair } from '@pangolindex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalancesWithLoadingIndicator } from '../wallet/hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../user/hooks'
import { StakingInfo } from '../stake/hooks'
import { useGetStakingDataWithAPR } from '../../state/stake/hooks'

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

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const v2AllPairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const allV2AllPairsWithLiquidity = v2AllPairs
    .map(([, pair]) => pair)
    .filter((v2AllPairs): v2AllPairs is Pair => Boolean(v2AllPairs))

  return { v2IsLoading, allV2PairsWithLiquidity, allPairs: allV2AllPairsWithLiquidity }
}

export function useGetMigrationData(version: number) {
  let { v2IsLoading, allV2PairsWithLiquidity, allPairs } = useGetUserLP()

  const [allPool, setAllPool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })

  const [loading, setLoading] = useState(false as boolean)

  const stakingInfos = useGetStakingDataWithAPR(Number(version))

  useEffect(() => {
    let pairs = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }
    setLoading(true)

    for (let index = 0; index < stakingInfos.length; index++) {
      const stakingInfo = stakingInfos[index]

      let pairAddress = stakingInfo?.stakedAmount?.token?.address
      let stakingData = stakingInfo

      let pair = allPairs.find(
        data => data?.liquidityToken?.address === stakingData?.stakedAmount?.token?.address
      ) as Pair

      if (stakingData?.stakedAmount.greaterThan('0')) {
        pairs[pairAddress] = {
          pair: pair,
          staking: stakingData
        }
      }
    }

    setLoading(false)
    setAllPool(pairs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(stakingInfos || []).length])
  v2IsLoading = loading

  return { allPool, v2IsLoading, allV2PairsWithLiquidity, allPairs }
}

import { useMemo, useState, useEffect } from 'react'
import { Pair } from '@pangolindex/sdk'
import { useGetStakingDataWithAPR } from '../../state/stake/hooks'
import { useGetUserLP, useMinichefPools, MinichefStakingInfo } from '@pangolindex/components'

export function useGetMigrationData(version: number) {
  const { v2IsLoading, allV2PairsWithLiquidity, allPairs } = useGetUserLP()

  const [allPool, setAllPool] = useState({} as { [address: string]: { pair: Pair; staking: MinichefStakingInfo } })

  const stakingInfos = useGetStakingDataWithAPR(Number(version))

  const poolMap = useMinichefPools()
  /* eslint-disable prefer-const */
  useEffect(() => {
    let pairs = {} as { [address: string]: { pair: Pair; staking: MinichefStakingInfo } }

    for (const stakingInfo of stakingInfos) {
      let pairAddress = stakingInfo?.stakedAmount?.token?.address
      let stakingData = stakingInfo

      let pair = (allPairs as Pair[]).find(
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

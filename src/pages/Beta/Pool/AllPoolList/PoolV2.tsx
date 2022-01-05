import React from 'react'
import { useMinichefPools, useMinichefStakingInfos } from 'src/state/stake/hooks'
import PoolList from './PoolList'

interface Props {}
const PoolV2: React.FC<Props> = () => {
  const stakingInfos = useMinichefStakingInfos(2)
  const poolMap = useMinichefPools()

  return <PoolList version="2" stakingInfos={stakingInfos} poolMap={poolMap} />
}

export default PoolV2

import React from 'react'
import { DoubleSideStakingInfo, useMinichefPools } from 'src/state/stake/hooks'
import PoolList from './PoolList'
import { PoolType } from '../index'

interface Props {
  type: string
  stakingInfos: DoubleSideStakingInfo[]
}

const PoolV2: React.FC<Props> = ({ type, stakingInfos }) => {
  const poolMap = useMinichefPools()

  if (type === PoolType.own) {
    stakingInfos = (stakingInfos || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }

  if (type === PoolType.superFarms) {
    stakingInfos = (stakingInfos || []).filter(item => (item?.rewardTokensAddress?.length || 0) > 0)
  }
  return <PoolList version="2" stakingInfos={stakingInfos} poolMap={poolMap} />
}

export default PoolV2

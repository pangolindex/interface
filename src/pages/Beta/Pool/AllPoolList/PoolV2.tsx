import React from 'react'
import { useMinichefPools, useMinichefStakingInfos } from 'src/state/stake/hooks'
import PoolList from './PoolList'
import { PoolType } from '../index'

interface Props {
  type: string
}

const PoolV2: React.FC<Props> = ({ type }) => {
  let stakingInfos = useMinichefStakingInfos(2)
  const poolMap = useMinichefPools()

  if (type === PoolType.own) {
    stakingInfos = (stakingInfos || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }
  return <PoolList version="2" stakingInfos={stakingInfos} poolMap={poolMap} />
}

export default PoolV2

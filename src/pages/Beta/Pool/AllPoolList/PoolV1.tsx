import React from 'react'
import { useStakingInfo } from 'src/state/stake/hooks'
import PoolList from './PoolList'
import { PoolType } from '../index'
interface Props {
  type: string
}

const PoolV1: React.FC<Props> = ({ type }) => {
  let stakingInfos = useStakingInfo(1)

  if (type === PoolType.own) {
    stakingInfos = (stakingInfos || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }

  return <PoolList version="1" stakingInfos={stakingInfos} />
}

export default PoolV1

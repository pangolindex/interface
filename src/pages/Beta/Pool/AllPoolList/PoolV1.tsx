import React from 'react'
import { useStakingInfo } from 'src/state/stake/hooks'
import PoolList from './PoolList'

interface Props {}
const PoolV1: React.FC<Props> = () => {
  const stakingInfos = useStakingInfo(1)

  return <PoolList version="1" stakingInfos={stakingInfos} />
}

export default PoolV1

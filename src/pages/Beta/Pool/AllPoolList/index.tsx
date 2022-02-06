import React from 'react'
import { DoubleSideStakingInfo } from 'src/state/stake/hooks'
import PoolV1 from './PoolV1'
import PoolV2 from './PoolV2'

interface Props {
  version: number
  type: string
  stakingInfoV1: DoubleSideStakingInfo[]
  stakingInfoV2: DoubleSideStakingInfo[]
}

const AllPoolList: React.FC<Props> = ({ version, type, stakingInfoV1, stakingInfoV2 }) => {
  return version === 1 ? (
    <PoolV1 type={type} stakingInfos={stakingInfoV1} />
  ) : (
    <PoolV2 type={type} stakingInfos={stakingInfoV2} />
  )
}

export default AllPoolList

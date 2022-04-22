import React from 'react'
import { useMinichefPools, useMinichefStakingInfos } from '../../state/stake/hooks'
import Earn from './Earn'

/* eslint-disable @typescript-eslint/no-empty-interface*/
interface Props {}
const EarnV2: React.FC<Props> = () => {
  const stakingInfos = useMinichefStakingInfos(2)
  const poolMap = useMinichefPools()

  return <Earn version="2" stakingInfos={stakingInfos} poolMap={poolMap} />
}

export default EarnV2

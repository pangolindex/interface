import React from 'react'
import { useMinichefStakingInfos } from '../../state/stake/hooks'
import Earn from './Earn'

interface Props {}
const EarnV2: React.FC<Props> = () => {
  const stakingInfos = useMinichefStakingInfos(2)

  return <Earn version="2" stakingInfos={stakingInfos} />
}

export default EarnV2

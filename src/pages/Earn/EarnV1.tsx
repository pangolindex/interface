import React from 'react'
import { useStakingInfo } from '../../state/stake/hooks'
import { RouteComponentProps } from 'react-router-dom'
import Earn from './Earn'

const EarnV1: React.FC<RouteComponentProps<{ version: string }>> = ({
  match: {
    params: { version }
  }
}) => {
  const stakingInfos = useStakingInfo(Number(version))

  return <Earn version={version} stakingInfos={stakingInfos} />
}

export default EarnV1

import React from 'react'
import { MinichefStakingInfo, useGetFarmApr, useGetEarnedAmount } from 'src/state/stake/hooks'
import PoolCardView from './PoolCardView'

export interface PoolCardProps {
  stakingInfo: MinichefStakingInfo
  onClickViewDetail: () => void
  version: number
}

const PoolCardV2 = ({ stakingInfo, onClickViewDetail, version }: PoolCardProps) => {
  const { combinedApr } = useGetFarmApr(stakingInfo?.pid)
  const { earnedAmount } = useGetEarnedAmount(stakingInfo?.pid)

  const rewardTokens = stakingInfo?.rewardTokens

  return (
    <PoolCardView
      combinedApr={combinedApr}
      earnedAmount={earnedAmount}
      rewardTokens={rewardTokens}
      stakingInfo={stakingInfo}
      onClickViewDetail={onClickViewDetail}
      version={version}
    />
  )
}

export default PoolCardV2

import React from 'react'
import { StakingInfo } from 'src/state/stake/hooks'
import { useTokens } from 'src/hooks/Tokens'
import PoolCardView from './PoolCardView'

export interface PoolCardV1Props {
  stakingInfo: StakingInfo
  onClickViewDetail: () => void
  version: number
}

const PoolCardV1 = ({ stakingInfo, onClickViewDetail, version }: PoolCardV1Props) => {
  const rewardTokens = useTokens(stakingInfo?.rewardTokensAddress)

  return (
    <PoolCardView
      combinedApr={stakingInfo?.combinedApr}
      earnedAmount={stakingInfo?.earnedAmount}
      rewardTokens={rewardTokens}
      stakingInfo={stakingInfo}
      onClickViewDetail={onClickViewDetail}
      version={version}
    />
  )
}

export default PoolCardV1

import { Token } from '@pangolindex/sdk'
import React, { useMemo } from 'react'
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'
import { useTokens } from 'src/hooks/Tokens'
import { MinichefStakingInfo, useGetFarmApr, useGetEarnedAmount } from 'src/state/stake/hooks'
import PoolCardView from './PoolCardView'

export interface PoolCardProps {
  stakingInfo: MinichefStakingInfo
  onClickViewDetail: () => void
  version: number
}

const PoolCardV2 = ({ stakingInfo, onClickViewDetail, version }: PoolCardProps) => {
  const chainId = useChainId()
  const { combinedApr } = useGetFarmApr(stakingInfo?.pid)
  const { earnedAmount } = useGetEarnedAmount(stakingInfo?.pid)

  let rewardTokens = stakingInfo?.rewardTokens

  const _rewardTokens = useTokens(stakingInfo.rewardTokensAddress)

  rewardTokens = useMemo(() => {
    if (!rewardTokens && _rewardTokens) {
      // filter only tokens
      const tokens = _rewardTokens.filter(token => token && token instanceof Token) as Token[]
      return [PNG[chainId], ...tokens]
    }
    return rewardTokens
  }, [chainId, _rewardTokens, rewardTokens])

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

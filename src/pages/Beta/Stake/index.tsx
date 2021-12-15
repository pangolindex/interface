import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PageWrapper, PageTitle, PoolsWrapper } from './styleds'
import { useActiveWeb3React } from 'src/hooks'
import Loader from 'src/components/Loader'
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from 'src/state/stake/singleSideConfig'
import { useSingleSideStakingInfo } from 'src/state/stake/hooks'
import { BIG_INT_ZERO } from 'src/constants'
import PoolCard from './PoolCard'

interface RouteParams {
  version: string
}

const StakeUI = () => {
  const params = useParams<RouteParams>()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useSingleSideStakingInfo(Number(params.version))
  const [stakingInfoResults, setStakingInfoResults] = useState<any[]>()

  useMemo(() => {
    Promise.all(
      stakingInfos
        ?.filter(function(info) {
          // Only include pools that are live or require a migration
          return !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
        })
        .sort(function(info_a, info_b) {
          // greater stake in png comes first
          return info_a.totalStakedInPng?.greaterThan(info_b.totalStakedInPng ?? BIG_INT_ZERO) ? -1 : 1
        })
        .sort(function(info_a, info_b) {
          if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO)) {
            if (info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              // both are being staked, so we keep the previous sorting
              return 0
            // the second is actually not at stake, so we should bring the first up
            else return -1
          } else {
            if (info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              // first is not being staked, but second is, so we should bring the first down
              return 1
            // none are being staked, let's keep the  previous sorting
            else return 0
          }
        })
    ).then(results => {
      setStakingInfoResults(results)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length])

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (SINGLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )

  return (
    <PageWrapper>
      <PageTitle>{t('stakePage.stakeAndEarn')}</PageTitle>
      <PoolsWrapper>
        {stakingRewardsExist && stakingInfos?.length === 0 ? (
          <Loader style={{ margin: 'auto' }} />
        ) : !stakingRewardsExist ? (
          t('earnPage.noActiveRewards')
        ) : (
          stakingInfoResults?.map(stakingInfo => (
            <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} version={params.version} />
          ))
        )}
      </PoolsWrapper>
    </PageWrapper>
  )
}
export default StakeUI

import React, { useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { useSingleSideStakingInfo } from '../../state/stake/hooks'
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from '../../state/stake/singleSideConfig'
import { TYPE } from '../../theme'
import SingleSidePoolCard from '../../components/earn/SingleSidePoolCard'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { BIG_INT_ZERO } from '../../constants'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const stakingInfos = useSingleSideStakingInfo(Number(version))
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

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
  `

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (SINGLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.pangolinLiquidityStaking')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.depositPangolinStaking')}</TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t('earnPage.currentOpportunities')}</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            t('earnPage.noActiveRewards')
          ) : (
            stakingInfoResults?.map(stakingInfo => (
              <SingleSidePoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} version={version} />
            ))
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

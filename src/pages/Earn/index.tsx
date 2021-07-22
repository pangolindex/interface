import React, { useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RouteComponentProps, NavLink } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@pangolindex/sdk'
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
  const stakingInfos = useStakingInfo(Number(version))
  const [stakingInfoResults, setStakingInfoResults] = useState<any[]>()

  useMemo(() => {
    Promise.all(
      stakingInfos
        ?.sort(function(info_a, info_b) {
          // greater stake in avax comes first
          return info_a.totalStakedInWavax?.greaterThan(info_b.totalStakedInWavax ?? JSBI.BigInt(0)) ? -1 : 1
        })
        .sort(function(info_a, info_b) {
          if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0))) {
            if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              // both are being staked, so we keep the previous sorting
              return 0
            // the second is actually not at stake, so we should bring the first up
            else return -1
          } else {
            if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              // first is not being staked, but second is, so we should bring the first down
              return 1
            // none are being staked, let's keep the  previous sorting
            else return 0
          }
        })
        .map(stakingInfo => {
          return fetch(`https://api.pangolin.exchange/pangolin/apr/${stakingInfo.stakingRewardAddress}`)
            .then(res => res.text())
            .then(res => ({ apr: res, ...stakingInfo }))
        })
    ).then(results => {
      setStakingInfoResults(results)
    })
  }, [stakingInfos?.length])

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.pangolinLiquidityMining')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.depositPangolinLiquidity')}</TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://pangolin.exchange/litepaper"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t('earnPage.readMoreAboutPng')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
        <DataCard>
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.importantUpdate')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.pangolinGovernanceProposalResult')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.toUnstake')}</TYPE.white>
              </RowBetween>{' '}
              <NavLink style={{ color: 'white', textDecoration: 'underline' }} to="/png/0" target="_blank">
                <TYPE.white fontSize={14}>{t('earnPage.oldPngPools')}</TYPE.white>
              </NavLink>
              <NavLink style={{ color: 'white', textDecoration: 'underline' }} to="/png/1" target="_blank">
                <TYPE.white fontSize={14}>{t('earnPage.newPngPools')}</TYPE.white>
              </NavLink>
            </AutoColumn>
          </CardSection>
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t('earnPage.participatingPools')}</TYPE.mediumHeader>
          <TYPE.black fontWeight={400}>{t('earnPage.rewardsNeverEnd')}</TYPE.black>
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            t('earnPage.noActiveRewards')
          ) : (
            stakingInfoResults?.map(stakingInfo => (
              <PoolCard
                apr={stakingInfo.apr}
                key={stakingInfo.stakingRewardAddress}
                stakingInfo={stakingInfo}
                version={version}
              />
            ))
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

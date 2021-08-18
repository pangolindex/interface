import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { MIGRATIONS, STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RouteComponentProps, NavLink } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '../../components/SearchModal/styleds'
import useDebounce from '../../hooks/useDebounce'

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

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
 `};
`

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const stakingInfos = useStakingInfo(Number(version))
  const [poolCards, setPoolCards] = useState<any[]>()
  const [filteredPoolCards, setFilteredPoolCards] = useState<any[]>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 250)

  const stakingInfoV0 = useStakingInfo(Number(0))
  const hasPositionV0 = stakingInfoV0?.some((stakingInfo) => stakingInfo.stakedAmount.greaterThan('0'))

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value.trim().toUpperCase())
  }, [])

  useEffect(() => {
    const filtered = poolCards?.filter(card =>
      card.props.stakingInfo.tokens[0].symbol.toUpperCase().includes(debouncedSearchQuery)
      || card.props.stakingInfo.tokens[1].symbol.toUpperCase().includes(debouncedSearchQuery))
    setFilteredPoolCards(filtered)
  }, [poolCards, debouncedSearchQuery])

  useMemo(() => {
    Promise.all(
      stakingInfos
        ?.filter(function(info) {
          // Only include pools that are live or require a migration
          return (!info.isPeriodFinished || info.stakedAmount.greaterThan(JSBI.BigInt(0)))
        })
        .sort(function(info_a, info_b) {
          // only first has ended
          if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
          // only second has ended
          if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
          // greater stake in avax comes first
          return info_a.totalStakedInWavax?.greaterThan(info_b.totalStakedInWavax ?? JSBI.BigInt(0)) ? -1 : 1
        })
        .sort(function(info_a, info_b) {
          // only the first is being staked, so we should bring the first up
          if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0)) && !info_b.stakedAmount.greaterThan(JSBI.BigInt(0))) return -1
          // only the second is being staked, so we should bring the first down
          if (!info_a.stakedAmount.greaterThan(JSBI.BigInt(0)) && info_b.stakedAmount.greaterThan(JSBI.BigInt(0))) return 1
          return 0
        })
        .sort(function(info_a, info_b) {
          // Bring pools that require migration to the top
          const aCanMigrate = MIGRATIONS.find(migration => migration.from.stakingRewardAddress === info_a.stakingRewardAddress)?.to
          const bCanMigrate = MIGRATIONS.find(migration => migration.from.stakingRewardAddress === info_b.stakingRewardAddress)?.to
          if (aCanMigrate && !bCanMigrate) return -1;
          if (!aCanMigrate && bCanMigrate) return 1;
          return 0;
        })
        .map(stakingInfo => {
          return fetch(`https://api.pangolin.exchange/pangolin/apr/${stakingInfo.stakingRewardAddress}`)
            .then(res => res.text())
            .then(res => ({ apr: res, ...stakingInfo }))
        })
    ).then(stakingInfos => {
      const poolCards = stakingInfos
        .map(stakingInfo => (
          <PoolCard
            apr={stakingInfo.apr}
            key={stakingInfo.stakingRewardAddress}
            stakingInfo={stakingInfo}
            migration={MIGRATIONS.find(migration => migration.from.stakingRewardAddress === stakingInfo.stakingRewardAddress)?.to}
            version={version}
          />
        ))
      setPoolCards(poolCards)
    })
  }, [stakingInfos?.length, version])

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
        {(hasPositionV0 || version === '0') && (
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
                {version !== '0' && (
                  <NavLink style={{ color: 'white', textDecoration: 'underline' }} to='/png/0'>
                    <TYPE.white fontSize={14}>{t('earnPage.oldPngPools')}</TYPE.white>
                  </NavLink>
                )}
              </AutoColumn>
            </CardSection>
          </DataCard>
        )}
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t('earnPage.participatingPools')}</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist || poolCards?.length === 0 ? (
            t('earnPage.noActiveRewards')
          ) : (
            <>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('searchModal.tokenName')}
                value={searchQuery}
                onChange={handleSearch}
              />
              {filteredPoolCards}
            </>
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

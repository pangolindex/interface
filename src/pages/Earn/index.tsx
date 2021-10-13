import React, { useCallback, useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import { MIGRATIONS, DOUBLE_SIDE_STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import DoubleSidePoolCard from '../../components/earn/DoubleSidePoolCard'
import { RouteComponentProps, NavLink } from 'react-router-dom'
import { AutoRow, RowBetween } from '../../components/Row'
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

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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

const SortSection = styled.div`
  display: flex;
`
const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`

const SortFieldContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  multiplier = 'multiplier',
  totalApr = 'totalApr'
}

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const stakingInfos = useStakingInfo(Number(version))
  const [poolCardsLoading, setPoolCardsLoading] = useState(false)
  const [poolCards, setPoolCards] = useState<any[]>()
  const [filteredPoolCards, setFilteredPoolCards] = useState<any[]>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<any>({ field: '', desc: true })
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [stakingInfoData, setStakingInfoData] = useState<any[]>(stakingInfos)

  const stakingInfoV0 = useStakingInfo(Number(0))
  const hasPositionV0 = stakingInfoV0?.some(stakingInfo => stakingInfo.stakedAmount.greaterThan('0'))

  const handleSearch = useCallback(event => {
    setSearchQuery(event.target.value.trim().toUpperCase())
  }, [])

  useEffect(() => {
    const filtered = poolCards?.filter(
      card =>
        card.props.stakingInfo.tokens[0].symbol.toUpperCase().includes(debouncedSearchQuery) ||
        card.props.stakingInfo.tokens[1].symbol.toUpperCase().includes(debouncedSearchQuery)
    )
    setFilteredPoolCards(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCards, debouncedSearchQuery])

  useEffect(() => {
    Promise.all(
      stakingInfoData.sort(function(info_a, info_b) {
        if (sortBy.field === SortingType.totalStakedInUsd) {
          if (sortBy.desc) {
            return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? JSBI.BigInt(0)) ? -1 : 1
          } else {
            return info_a.totalStakedInUsd?.lessThan(info_b.totalStakedInUsd ?? JSBI.BigInt(0)) ? -1 : 1
          }
        }
        if (sortBy.field === SortingType.multiplier) {
          if (sortBy.desc) {
            return JSBI.greaterThan(info_a.multiplier, info_b.multiplier) ? -1 : 1
          } else {
            return JSBI.lessThan(info_a.multiplier, info_b.multiplier) ? -1 : 1
          }
        }
        if (sortBy.field === SortingType.totalApr) {
          if (sortBy.desc) {
            return info_a.stakingApr + info_a.swapFeeApr > info_b.stakingApr + info_b.swapFeeApr ? -1 : 1
          } else {
            return info_a.stakingApr + info_a.swapFeeApr < info_b.stakingApr + info_b.swapFeeApr ? -1 : 1
          }
        }
        return 0
      })
    ).then(stakingInfoData => {
      const poolCards = stakingInfoData.map(stakingInfo => (
        <DoubleSidePoolCard
          swapFeeApr={stakingInfo.swapFeeApr}
          stakingApr={stakingInfo.stakingApr}
          key={stakingInfo.stakingRewardAddress}
          stakingInfo={stakingInfo}
          migration={
            MIGRATIONS.find(migration => migration.from.stakingRewardAddress === stakingInfo.stakingRewardAddress)?.to
          }
          version={version}
        />
      ))
      setPoolCards(poolCards)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy?.field, sortBy?.desc])

  useEffect(() => {
    setPoolCardsLoading(true)
    if (stakingInfos?.length > 0) {
      Promise.all(
        stakingInfos
          .filter(function(info) {
            // Only include pools that are live or require a migration
            return !info.isPeriodFinished || info.stakedAmount.greaterThan(JSBI.BigInt(0))
          })
          .sort(function(info_a, info_b) {
            // only first has ended
            if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
            // only second has ended
            if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
            // greater stake in avax comes first
            return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? JSBI.BigInt(0)) ? -1 : 1
          })
          .sort(function(info_a, info_b) {
            // only the first is being staked, so we should bring the first up
            if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0)) && !info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              return -1
            // only the second is being staked, so we should bring the first down
            if (!info_a.stakedAmount.greaterThan(JSBI.BigInt(0)) && info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              return 1
            return 0
          })
          .sort(function(info_a, info_b) {
            // Bring pools that require migration to the top
            const aCanMigrate = MIGRATIONS.find(
              migration => migration.from.stakingRewardAddress === info_a.stakingRewardAddress
            )?.to
            const bCanMigrate = MIGRATIONS.find(
              migration => migration.from.stakingRewardAddress === info_b.stakingRewardAddress
            )?.to
            if (aCanMigrate && !bCanMigrate) return -1
            if (!aCanMigrate && bCanMigrate) return 1
            return 0
          })
          .map(stakingInfo => {
            return fetch(`https://api.pangolin.exchange/pangolin/apr/${stakingInfo.stakingRewardAddress}`)
              .then(res => res.json())
              .then(res => ({
                swapFeeApr: Number(res.swapFeeApr),
                stakingApr: Number(res.stakingApr),
                combinedApr: Number(res.combinedApr),
                ...stakingInfo
              }))
          })
      ).then(updatedStakingInfos => {
        const poolCards = updatedStakingInfos.map(stakingInfo => (
          <DoubleSidePoolCard
            swapFeeApr={stakingInfo.swapFeeApr}
            stakingApr={stakingInfo.stakingApr}
            key={stakingInfo.stakingRewardAddress}
            stakingInfo={stakingInfo}
            migration={
              MIGRATIONS.find(migration => migration.from.stakingRewardAddress === stakingInfo.stakingRewardAddress)?.to
            }
            version={version}
          />
        ))
        setStakingInfoData(updatedStakingInfos)
        setPoolCards(poolCards)
        setPoolCardsLoading(false)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length, version])

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )

  const getSortField = (label: string, field: string, sortBy: any, setSortBy: Function) => {
    return (
      <SortField
        onClick={() => {
          const desc = sortBy?.field === field ? !sortBy?.desc : true
          setSortBy({ field, desc })
        }}
      >
        {label}
        {sortBy?.field === field && (sortBy?.desc ? <ChevronDown size="16" /> : <ChevronUp size="16" />)}
      </SortField>
    )
  }

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
              <AutoRow justify="space-between">
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  href="https://pangolin.exchange/litepaper"
                  target="_blank"
                >
                  <TYPE.white fontSize={14}>{t('earnPage.readMoreAboutPng')}</TYPE.white>
                </ExternalLink>
                <FlexDiv>
                  <ExternalLink
                    style={{ color: 'white', textDecoration: 'underline', marginRight: 10 }}
                    href="https://app.nexusmutual.io/cover/buy/get-quote?address=0xefa94DE7a4656D787667C749f7E1223D71E9FD88"
                    target="_blank"
                  >
                    <TYPE.white fontSize={14}>{t('earnPage.getCoverNexusMutual')}</TYPE.white>
                  </ExternalLink>
                  <ExternalLink
                    style={{ color: 'white', textDecoration: 'underline' }}
                    href="https://app.insurace.io/Insurance/BuyCovers?referrer=565928487188065888397039055593264600345483712698"
                    target="_blank"
                  >
                    <TYPE.white fontSize={14}>{t('earnPage.getInsuranceCoverage')}</TYPE.white>
                  </ExternalLink>
                </FlexDiv>
              </AutoRow>
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
                  <NavLink style={{ color: 'white', textDecoration: 'underline' }} to="/png/0">
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
          {(stakingRewardsExist && stakingInfos?.length === 0) || poolCardsLoading ? (
            <Loader style={{ margin: 'auto' }} />
          ) : (!stakingRewardsExist || poolCards?.length === 0) && !poolCardsLoading ? (
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
              <SortSection>
                Sort by :{' '}
                <SortFieldContainer>
                  {getSortField('Liquidity', SortingType.totalStakedInUsd, sortBy, setSortBy)} |{' '}
                  {getSortField('Pool Weight', SortingType.multiplier, sortBy, setSortBy)} |{' '}
                </SortFieldContainer>
                {getSortField('APR', SortingType.totalApr, sortBy, setSortBy)}
              </SortSection>

              {filteredPoolCards}
            </>
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

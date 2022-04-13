import React, { useCallback, useEffect, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { TextInput, Box } from '@pangolindex/components'
import { DoubleSideStakingInfo } from 'src/state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from 'src/state/stake/doubleSideConfig'
import PoolCard from '../PoolCard'
import Loader from 'src/components/Loader'
import { useChainId } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { Search } from 'react-feather'
import useDebounce from 'src/hooks/useDebounce'
import { BIG_INT_ZERO, PANGOLIN_API_BASE_URL } from 'src/constants'
import Scrollbars from 'react-custom-scrollbars'
import { PoolsWrapper, PanelWrapper, LoadingWrapper, MobileGridContainer } from './styleds'
import { usePoolDetailnModalToggle } from 'src/state/application/hooks'
import DetailModal from '../../DetailModal'
import DropdownMenu from 'src/components/Beta/DropdownMenu'
import { Hidden } from 'src/theme'

export enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

export const SortOptions = [
  {
    label: 'Liquidity',
    value: SortingType.totalStakedInUsd
  },
  {
    label: 'APR',
    value: SortingType.totalApr
  }
]

export interface EarnProps {
  version: string
  stakingInfos: DoubleSideStakingInfo[]
  poolMap?: { [key: string]: number }
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolList: React.FC<EarnProps> = ({ version, stakingInfos, poolMap, setMenu, activeMenu, menuItems }) => {
  const chainId = useChainId()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [poolCardsLoading, setPoolCardsLoading] = useState(false)
  const [poolCards, setPoolCards] = useState<any[]>()
  const [filteredPoolCards, setFilteredPoolCards] = useState<any[]>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [stakingInfoData, setStakingInfoData] = useState<any[]>(stakingInfos)

  const [selectedPoolIndex, setSelectedPoolIndex] = useState(-1)

  const togglePoolDetailModal = usePoolDetailnModalToggle()

  const handleSearch = useCallback(value => {
    setSearchQuery(value.trim().toUpperCase())
  }, [])

  useEffect(() => {
    const filtered = poolCards?.filter(
      card =>
        card?.props?.stakingInfo?.tokens[0].symbol.toUpperCase().includes(debouncedSearchQuery) ||
        card?.props?.stakingInfo?.tokens[1].symbol.toUpperCase().includes(debouncedSearchQuery)
    )

    setFilteredPoolCards(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCards, debouncedSearchQuery])

  useEffect(() => {
    Promise.all(
      stakingInfoData.sort(function(info_a, info_b) {
        if (sortBy === SortingType.totalStakedInUsd) {
          return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
        }

        if (sortBy === SortingType.totalApr) {
          return info_a.stakingApr + info_a.swapFeeApr > info_b.stakingApr + info_b.swapFeeApr ? -1 : 1
        }
        return 0
      })
    ).then(stakingInfoData => {
      const poolCards = stakingInfoData.map((stakingInfo, index) => {
        // console.log('stakinginfo', stakingInfo)
        return (
          <PoolCard
            key={index}
            stakingInfo={stakingInfo}
            onClickViewDetail={() => {
              // let container = {} as { [address: string]: { staking: StakingInfo } }
              // container[stakingInfo.stakingRewardAddress] = stakingInfo
              setSelectedPoolIndex(index)
              togglePoolDetailModal()
            }}
            version={Number(version)}
          />
        )
      })
      setPoolCards(poolCards)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, stakingInfoData])

  useEffect(() => {
    setPoolCardsLoading(true)

    if (stakingInfos?.length > 0) {
      Promise.all(
        stakingInfos
          .filter(function(info) {
            // Only include pools that are live or require a migration
            return !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
          })
          .sort(function(info_a, info_b) {
            // only first has ended
            if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
            // only second has ended
            if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
            // greater stake in avax comes first
            return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
          })
          .sort(function(info_a, info_b) {
            // only the first is being staked, so we should bring the first up
            if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && !info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              return -1
            // only the second is being staked, so we should bring the first down
            if (!info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              return 1
            return 0
          })
          // TODO: update here api call without staking reward address
          .map(stakingInfo => {
            if (poolMap) {
              return fetch(
                `${PANGOLIN_API_BASE_URL}/pangolin/apr2/${poolMap[stakingInfo.totalStakedAmount.token.address]}`
              )
                .then(res => res.json())
                .then(res => ({
                  swapFeeApr: Number(res.swapFeeApr),
                  stakingApr: Number(res.stakingApr),
                  combinedApr: Number(res.combinedApr),
                  ...stakingInfo
                }))
            } else {
              return fetch(`${PANGOLIN_API_BASE_URL}/pangolin/apr/${stakingInfo.stakingRewardAddress}`)
                .then(res => res.json())
                .then(res => ({
                  swapFeeApr: Number(res.swapFeeApr),
                  stakingApr: Number(res.stakingApr),
                  combinedApr: Number(res.combinedApr),
                  ...stakingInfo
                }))
            }
          })
      ).then(updatedStakingInfos => {
        const poolCards = updatedStakingInfos.map((stakingInfo, index) => {
          return (
            <PoolCard
              key={index}
              stakingInfo={stakingInfo}
              onClickViewDetail={() => {
                // let container = {} as { [address: string]: { staking: StakingInfo } }
                // container[stakingInfo.stakingRewardAddress] = { staking: stakingInfo }
                setSelectedPoolIndex(index)
                togglePoolDetailModal()
              }}
              version={Number(version)}
            />
          )
        })

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
  const selectedPool: DoubleSideStakingInfo = selectedPoolIndex !== -1 ? stakingInfoData[selectedPoolIndex] : undefined

  return (
    <PoolsWrapper>
      {(stakingRewardsExist && stakingInfos?.length === 0) || poolCardsLoading ? (
        <LoadingWrapper>
          <Loader style={{ margin: 'auto' }} size="35px" stroke={theme.primary} />
        </LoadingWrapper>
      ) : (!stakingRewardsExist || poolCards?.length === 0) && !poolCardsLoading ? (
        t('earnPage.noActiveRewards')
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
            <Box width="100%">
              <TextInput
                placeholder={t('searchModal.tokenName')}
                onChange={handleSearch}
                value={searchQuery}
                id="token-search-input"
                addonAfter={<Search style={{ marginTop: '5px' }} color={theme.text2} size={20} />}
              />
            </Box>
            <Hidden upToSmall={true}>
              <Box ml={10}>
                <DropdownMenu
                  title="Sort by:"
                  options={SortOptions}
                  value={sortBy}
                  onSelect={value => {
                    setSortBy(value)
                  }}
                  height="54px"
                />
              </Box>
            </Hidden>
          </Box>
          <MobileGridContainer>
            <DropdownMenu
              options={menuItems}
              value={activeMenu}
              onSelect={value => {
                setMenu(value)
              }}
            />
            <DropdownMenu
              title="Sort by:"
              options={SortOptions}
              value={sortBy}
              onSelect={value => {
                setSortBy(value)
              }}
            />
          </MobileGridContainer>

          <Scrollbars>
            <PanelWrapper>{filteredPoolCards}</PanelWrapper>
          </Scrollbars>
        </>
      )}

      <DetailModal stakingInfo={selectedPool} version={Number(version)} />
    </PoolsWrapper>
  )
}

export default PoolList

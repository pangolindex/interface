import React, { useCallback, useEffect, useState, useContext, memo } from 'react'
import { ThemeContext } from 'styled-components'
import { TextInput, Box } from '@pangolindex/components'
import { MinichefStakingInfo, useSortFarmAprs, useFetchFarmAprs } from 'src/state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from 'src/state/stake/doubleSideConfig'
import PoolCardV2 from '../PoolCard/PoolCardV2'
import Loader from 'src/components/Loader'
import { useChainId } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { Search } from 'react-feather'
import useDebounce from 'src/hooks/useDebounce'
import { BIG_INT_ZERO } from 'src/constants'
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
  stakingInfos: MinichefStakingInfo[]
  poolMap?: { [key: string]: number }
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolListV2: React.FC<EarnProps> = ({ version, stakingInfos, setMenu, activeMenu, menuItems }) => {
  const chainId = useChainId()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [poolCardsLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [stakingInfoData, setStakingInfoData] = useState<MinichefStakingInfo[]>(stakingInfos)

  const [selectedPoolIndex, setSelectedPoolIndex] = useState(-1)

  const togglePoolDetailModal = usePoolDetailnModalToggle()
  useFetchFarmAprs()
  const sortedFarmsApr = useSortFarmAprs()

  const handleSearch = useCallback(value => {
    setSearchQuery(value.trim().toUpperCase())
  }, [])

  useEffect(() => {
    const filtered = stakingInfos.filter(function(stakingInfo) {
      return (
        (stakingInfo?.tokens?.[0]?.symbol || '').toUpperCase().includes(debouncedSearchQuery) ||
        (stakingInfo?.tokens?.[1]?.symbol || '').toUpperCase().includes(debouncedSearchQuery)
      )
    })

    setStakingInfoData(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery])

  useEffect(() => {
    if (sortBy === SortingType.totalStakedInUsd) {
      const updatedStakingInfos = stakingInfoData.sort(function(info_a, info_b) {
        return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
      })
      setStakingInfoData(updatedStakingInfos)
    }

    if (sortBy === SortingType.totalApr) {
      const sortedFarms = sortedFarmsApr
        .map(item => stakingInfoData.find(infoItem => infoItem?.pid === item.pid) as MinichefStakingInfo)
        .filter(element => !!element)
      setStakingInfoData(sortedFarms)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  useEffect(() => {
    if (stakingInfos?.length > 0) {
      const updatedStakingInfos = stakingInfos
        // sort by total staked
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
          if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && !info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return -1
          // only the second is being staked, so we should bring the first down
          if (!info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return 1
          return 0
        })

      setStakingInfoData(updatedStakingInfos)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos])

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )
  const selectedPool = selectedPoolIndex !== -1 ? stakingInfoData[selectedPoolIndex] : ({} as MinichefStakingInfo)

  return (
    <PoolsWrapper>
      {(stakingRewardsExist && stakingInfos?.length === 0) || poolCardsLoading ? (
        <LoadingWrapper>
          <Loader style={{ margin: 'auto' }} size="35px" stroke={theme.primary} />
        </LoadingWrapper>
      ) : (!stakingRewardsExist || stakingInfoData?.length === 0) && !poolCardsLoading ? (
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
            <PanelWrapper>
              {stakingInfoData.map((stakingInfo, index) => (
                <PoolCardV2
                  key={index}
                  stakingInfo={stakingInfo}
                  onClickViewDetail={() => {
                    setSelectedPoolIndex(index)
                    togglePoolDetailModal()
                  }}
                  version={Number(version)}
                />
              ))}
            </PanelWrapper>
          </Scrollbars>
        </>
      )}

      <DetailModal stakingInfo={selectedPool} version={Number(version)} />
    </PoolsWrapper>
  )
}

export default memo(PoolListV2)

import React, { useCallback, useEffect, useState, memo, useMemo, useContext } from 'react'
import {
  MinichefStakingInfo,
  useSortFarmAprs,
  useFetchFarmAprs,
  useUpdateAllFarmsEarnAmount,
  sortingOnAvaxStake,
  sortingOnStakedAmount
} from 'src/state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from 'src/state/stake/doubleSideConfig'
import PoolCardV2 from '../PoolCard/PoolCardV2'
import { useChainId } from 'src/hooks'
import useDebounce from 'src/hooks/useDebounce'
import { BIG_INT_ZERO } from 'src/constants'
import { usePoolDetailnModalToggle, useToggleModal } from 'src/state/application/hooks'
import PoolCardListView, { SearchTokenContext, SortingType } from './PoolCardListView'
import { useAllTokens } from '@pangolindex/components'
import { FindButton } from './styleds'
import { ApplicationModal } from 'src/state/application/actions'
import { CAVAX, Currency } from '@pangolindex/sdk'

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

  const [poolCardsLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [stakingInfoData, setStakingInfoData] = useState<MinichefStakingInfo[]>([])

  const [selectedPoolIndex, setSelectedPoolIndex] = useState(-1)

  const togglePoolDetailModal = usePoolDetailnModalToggle()
  const toggleAddLiquidityModalOpen = useToggleModal(ApplicationModal.ADD_LIQUIDITY)

  // fetch farms earned amount
  useUpdateAllFarmsEarnAmount()
  // fetch farms apr
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
      const sortedFarms = [...stakingInfoData].sort(function(info_a, info_b) {
        return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
      })
      setStakingInfoData(sortedFarms)
    } else if (sortBy === SortingType.totalApr) {
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
        .sort(sortingOnAvaxStake)
        .sort(sortingOnStakedAmount)

      setStakingInfoData(updatedStakingInfos)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos])

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )
  const selectedPool = selectedPoolIndex !== -1 ? stakingInfoData[selectedPoolIndex] : ({} as MinichefStakingInfo)

  const allTokens = useAllTokens()
  const searchToken = useMemo(() => {
    const tokens = Object.values(allTokens) as Currency[]
    tokens.unshift(CAVAX[chainId])
    return tokens.find(token => token.symbol === searchQuery || token.name === searchQuery)
  }, [allTokens, searchQuery, chainId])

  const { setToken } = useContext(SearchTokenContext)
  useEffect(() => {
    setToken(searchToken)
  }, [searchToken, setToken])

  return (
    <PoolCardListView
      version={version}
      setMenu={setMenu}
      activeMenu={activeMenu}
      menuItems={menuItems}
      handleSearch={handleSearch}
      onChangeSortBy={setSortBy}
      sortBy={sortBy}
      searchQuery={searchQuery}
      isLoading={(stakingRewardsExist && stakingInfoData?.length === 0 && !searchQuery) || poolCardsLoading}
      doesNotPoolExist={(!stakingRewardsExist || stakingInfoData?.length === 0) && !poolCardsLoading}
      selectedPool={selectedPool}
    >
      {stakingInfoData.map((stakingInfo, index) => (
        <PoolCardV2
          key={stakingInfo?.pid}
          stakingInfo={stakingInfo}
          onClickViewDetail={() => {
            setSelectedPoolIndex(index)
            togglePoolDetailModal()
          }}
          version={Number(version)}
        />
      ))}

      {searchToken && (
        <FindButton variant="primary" onClick={toggleAddLiquidityModalOpen}>
          Find pools
        </FindButton>
      )}
    </PoolCardListView>
  )
}

export default memo(PoolListV2)

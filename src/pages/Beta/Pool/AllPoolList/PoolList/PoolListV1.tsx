import React, { useCallback, useEffect, useState } from 'react'
import { DoubleSideStakingInfo, sortingOnAvaxStake, sortingOnStakedAmount } from 'src/state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from 'src/state/stake/doubleSideConfig'
import PoolCardV1 from '../PoolCard/PoolCardV1'
import { useChainId } from 'src/hooks'
import useDebounce from 'src/hooks/useDebounce'
import { BIG_INT_ZERO, PANGOLIN_API_BASE_URL } from 'src/constants'
import { usePoolDetailnModalToggle } from 'src/state/application/hooks'
import PoolCardListView, { SortingType } from './PoolCardListView'

export interface EarnProps {
  version: string
  stakingInfos: DoubleSideStakingInfo[]
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolListV1: React.FC<EarnProps> = ({ version, stakingInfos, setMenu, activeMenu, menuItems }) => {
  const chainId = useChainId()

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
    ).then(newStakingInfoData => {
      const newPoolCards = newStakingInfoData.map((stakingInfo, index) => {
        return (
          <PoolCardV1
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
      setPoolCards(newPoolCards)
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
          .sort(sortingOnAvaxStake)
          .sort(sortingOnStakedAmount)
          .map(stakingInfo => {
            return fetch(`${PANGOLIN_API_BASE_URL}/pangolin/apr/${stakingInfo.stakingRewardAddress}`)
              .then(res => res.json())
              .then(res => ({
                swapFeeApr: Number(res.swapFeeApr),
                stakingApr: Number(res.stakingApr),
                combinedApr: Number(res.combinedApr),
                ...stakingInfo
              }))
          })
      ).then(updatedStakingInfos => {
        const sortedPoolCards = updatedStakingInfos.map((stakingInfo, index) => {
          return (
            <PoolCardV1
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
        setPoolCards(sortedPoolCards)
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
    <PoolCardListView
      version={version}
      setMenu={setMenu}
      activeMenu={activeMenu}
      menuItems={menuItems}
      handleSearch={handleSearch}
      onChangeSortBy={setSortBy}
      sortBy={sortBy}
      searchQuery={searchQuery}
      isLoading={(stakingRewardsExist && stakingInfos?.length === 0) || poolCardsLoading}
      doesPoolExist={!((!stakingRewardsExist || poolCards?.length === 0) && !poolCardsLoading)}
      selectedPool={selectedPool}
    >
      {filteredPoolCards}
    </PoolCardListView>
  )
}

export default PoolListV1

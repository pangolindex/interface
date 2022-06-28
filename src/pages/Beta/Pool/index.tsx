import React, { useState, useCallback, useMemo } from 'react'
import { Box } from '@pangolindex/components'
import { PageWrapper, GridContainer, ExternalLink } from './styleds'
import Sidebar, { MenuType } from './Sidebar'
import AllPoolList from './AllPoolList'
import Wallet from './Wallet'
import { useTranslation } from 'react-i18next'
import { useStakingInfo, useGetMinichefStakingInfosViaSubgraph, useGetAllFarmData } from 'src/state/stake/hooks'
import { BIG_INT_ZERO } from 'src/constants'
import { Hidden } from 'src/theme'
import AddLiquidityModal from './AddLiquidityModal'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { ApplicationModal } from 'src/state/application/actions'
import { SearchTokenContext } from './AllPoolList/PoolList/PoolCardListView'
import { Currency } from '@pangolindex/sdk'

export enum PoolType {
  own = 'own',
  all = 'all',
  superFarms = 'superFarms'
}

const PoolUI = () => {
  const [activeMenu, setMenu] = useState<string>(MenuType.allFarmV2)
  const isAddLiquidityModalOpen = useModalOpen(ApplicationModal.ADD_LIQUIDITY)
  const toggleAddLiquidityModalOpen = useToggleModal(ApplicationModal.ADD_LIQUIDITY)
  const { t } = useTranslation()

  const [searchToken, setSearchToken] = useState<Currency | undefined>(undefined)

  useGetAllFarmData()

  let miniChefStakingInfo = useGetMinichefStakingInfosViaSubgraph()

  let stakingInfoV1 = useStakingInfo(1)
  // filter only live or needs migration pools
  stakingInfoV1 = useMemo(
    () => (stakingInfoV1 || []).filter(info => !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)),
    [stakingInfoV1]
  )

  const ownStakingInfoV1 = useMemo(
    () =>
      (stakingInfoV1 || []).filter(stakingInfo => {
        return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
      }),
    [stakingInfoV1]
  )

  // filter only live or needs migration pools
  miniChefStakingInfo = useMemo(
    () =>
      (miniChefStakingInfo || []).filter(info => !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)),
    [miniChefStakingInfo]
  )

  const ownminiChefStakingInfo = useMemo(
    () =>
      (miniChefStakingInfo || []).filter(stakingInfo => {
        return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
      }),
    [miniChefStakingInfo]
  )

  const superFarms = useMemo(() => miniChefStakingInfo.filter(item => (item?.rewardTokens?.length || 0) > 1), [
    miniChefStakingInfo
  ])

  const menuItems: Array<{ label: string; value: string }> = []

  // add v1
  if (stakingInfoV1.length > 0) {
    menuItems.push({
      label: `${t('pool.allFarms')} (V1)`,
      value: MenuType.allFarmV1
    })
  }
  // add v2
  if (miniChefStakingInfo.length > 0) {
    menuItems.push({
      label: stakingInfoV1.length > 0 ? `${t('pool.allFarms')} (V2)` : `${t('pool.allFarms')}`,
      value: MenuType.allFarmV2
    })
  }
  // add own v1
  if (ownStakingInfoV1.length > 0) {
    menuItems.push({
      label: `${t('pool.yourFarms')} (V1)`,
      value: MenuType.yourFarmV1
    })
  }
  // add own v2
  if (ownminiChefStakingInfo.length > 0) {
    menuItems.push({
      label: ownStakingInfoV1.length > 0 ? `${t('pool.yourFarms')} (V2)` : `${t('pool.yourFarms')}`,
      value: MenuType.yourFarmV2
    })
  }
  // add superfarm
  if (superFarms.length > 0) {
    menuItems.push({
      label: 'Super Farms',
      value: MenuType.superFarm
    })
  }

  if (menuItems.length > 0) {
    // add wallet
    menuItems.push({
      label: `${t('pool.yourPools')}`,
      value: MenuType.yourPool
    })
  }

  const handleSetMenu = useCallback(
    (value: string) => {
      setMenu(value)
    },
    [setMenu]
  )
  return (
    <SearchTokenContext.Provider value={{ token: searchToken, setToken: token => setSearchToken(token) }}>
      <PageWrapper>
        <GridContainer>
          <Box display="flex" height="100%">
            <Sidebar
              activeMenu={activeMenu}
              setMenu={handleSetMenu}
              menuItems={menuItems}
              onManagePoolsClick={() => {
                setMenu(MenuType.yourPool)
              }}
            />
            {(activeMenu === MenuType.allFarmV1 ||
              activeMenu === MenuType.allFarmV2 ||
              activeMenu === MenuType.yourFarmV1 ||
              activeMenu === MenuType.yourFarmV2 ||
              activeMenu === MenuType.superFarm) && (
              <AllPoolList
                type={
                  activeMenu === MenuType.allFarmV1 || activeMenu === MenuType.allFarmV2
                    ? PoolType.all
                    : activeMenu === MenuType.superFarm
                    ? PoolType.superFarms
                    : PoolType.own
                }
                version={activeMenu === MenuType.allFarmV1 || activeMenu === MenuType.yourFarmV1 ? 1 : 2}
                stakingInfoV1={stakingInfoV1}
                miniChefStakingInfo={miniChefStakingInfo}
                activeMenu={activeMenu}
                setMenu={handleSetMenu}
                menuItems={menuItems}
              />
            )}
            {activeMenu === MenuType.yourPool && (
              <Wallet activeMenu={activeMenu} setMenu={handleSetMenu} menuItems={menuItems} />
            )}
          </Box>
          <Hidden upToSmall={true}>
            <Box>
              <ExternalLink onClick={toggleAddLiquidityModalOpen} style={{ cursor: 'pointer' }}>
                {t('navigationTabs.createPair')}
              </ExternalLink>
            </Box>
          </Hidden>
        </GridContainer>
        {isAddLiquidityModalOpen && (
          <AddLiquidityModal
            token0={searchToken}
            isOpen={isAddLiquidityModalOpen}
            onClose={toggleAddLiquidityModalOpen}
          />
        )}
      </PageWrapper>
    </SearchTokenContext.Provider>
  )
}
export default PoolUI

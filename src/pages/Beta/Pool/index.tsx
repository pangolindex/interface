import React, { useState } from 'react'
import { Box } from '@pangolindex/components'
import { PageWrapper, GridContainer, ExternalLink } from './styleds'
import Sidebar from './Sidebar'
import AllPoolList from './AllPoolList'
import Wallet from './Wallet'
import { MenuType } from './Sidebar'
import { useTranslation } from 'react-i18next'
import {
  useStakingInfo,
  useGetMinichefStakingInfosViaSubgraph,
  useGetAllFarmData
} from 'src/state/stake/hooks'
import { BIG_INT_ZERO } from 'src/constants'
import { Hidden } from 'src/theme'

export enum PoolType {
  own = 'own',
  all = 'all',
  superFarms = 'superFarms'
}

const PoolUI = () => {
  const [activeMenu, setMenu] = useState<string>(MenuType.allPoolV2)
  const { t } = useTranslation()

  useGetAllFarmData()

  let miniChefStakingInfo = useGetMinichefStakingInfosViaSubgraph()

  let stakingInfoV1 = useStakingInfo(1)
  // filter only live or needs migration pools
  stakingInfoV1 = (stakingInfoV1 || []).filter(
    info => !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
  )
  const ownStakingInfoV1 = (stakingInfoV1 || []).filter(stakingInfo => {
    return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
  })


  // filter only live or needs migration pools
  miniChefStakingInfo = (miniChefStakingInfo || []).filter(
    info => !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
  )
  const ownminiChefStakingInfo = (miniChefStakingInfo || []).filter(stakingInfo => {
    return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
  })

  const superFarms = miniChefStakingInfo.filter(item => (item?.rewardTokens?.length || 0) > 1)

  const menuItems: Array<{ label: string; value: string }> = []

  // add v1
  if (stakingInfoV1.length > 0) {
    menuItems.push({
      label: `${t('pool.allPools')} (V1)`,
      value: MenuType.allPoolV1
    })
  }
  // add v2
  if (miniChefStakingInfo.length > 0) {
    menuItems.push({
      label: stakingInfoV1.length > 0 ? `${t('pool.allPools')} (V2)` : `${t('pool.allPools')}`,
      value: MenuType.allPoolV2
    })
  }
  // add own v1
  if (ownStakingInfoV1.length > 0) {
    menuItems.push({
      label: `${t('pool.yourPools')} (V1)`,
      value: MenuType.yourPoolV1
    })
  }
  // add own v2
  if (ownminiChefStakingInfo.length > 0) {
    menuItems.push({
      label: ownStakingInfoV1.length > 0 ? `${t('pool.yourPools')} (V2)` : `${t('pool.yourPools')}`,
      value: MenuType.yourPoolV2
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
      label: `${t('pool.yourWallet')}`,
      value: MenuType.yourWallet
    })
  }

  console.log("activeMenu",activeMenu)

  return (
    <PageWrapper>
      <GridContainer>
        <Box display="flex" height="100%">
          <Sidebar
            activeMenu={activeMenu}
            setMenu={(value: string) => setMenu(value)}
            menuItems={menuItems}
            onManagePoolsClick={() => {
              setMenu(MenuType.yourWallet)
            }}
          />
          {(activeMenu === MenuType.allPoolV1 ||
            activeMenu === MenuType.allPoolV2 ||
            activeMenu === MenuType.yourPoolV2 ||
            activeMenu === MenuType.yourPoolV1 ||
            activeMenu === MenuType.superFarm) && (
            <AllPoolList
              type={
                activeMenu === MenuType.allPoolV1 || activeMenu === MenuType.allPoolV2
                  ? PoolType.all
                  : activeMenu === MenuType.superFarm
                  ? PoolType.superFarms
                  : PoolType.own
              }
              version={activeMenu === MenuType.allPoolV1 || activeMenu === MenuType.yourPoolV1 ? 1 : 2}
              stakingInfoV1={stakingInfoV1}
              miniChefStakingInfo={miniChefStakingInfo}
              activeMenu={activeMenu}
              setMenu={(value: string) => setMenu(value)}
              menuItems={menuItems}
            />
          )}
          {activeMenu === MenuType.yourWallet && (
            <Wallet activeMenu={activeMenu} setMenu={(value: string) => setMenu(value)} menuItems={menuItems} />
          )}
        </Box>

        <Hidden upToSmall={true}>
          <Box>
            <ExternalLink
              href="https://app.nexusmutual.io/cover/buy/get-quote?address=0xefa94DE7a4656D787667C749f7E1223D71E9FD88"
              target="_blank"
            >
              {t('earnPage.getCoverNexusMutual')}
            </ExternalLink>
            <ExternalLink
              href="https://app.insurace.io/Insurance/BuyCovers?referrer=565928487188065888397039055593264600345483712698"
              target="_blank"
            >
              {t('earnPage.getInsuranceCoverage')}
            </ExternalLink>
            {/* <Migration /> */}
          </Box>
        </Hidden>
      </GridContainer>
    </PageWrapper>
  )
}
export default PoolUI

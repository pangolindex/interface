import React from 'react'
import { DoubleSideStakingInfo, useMinichefPools, MinichefStakingInfo } from 'src/state/stake/hooks'
import PoolListV2 from './PoolList/PoolListV2'
import { PoolType } from '../index'

interface Props {
  type: string
  stakingInfos: DoubleSideStakingInfo[]
  miniChefStakingInfo: MinichefStakingInfo[]
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolV2: React.FC<Props> = ({ type, stakingInfos, setMenu, activeMenu, menuItems, miniChefStakingInfo }) => {
  const poolMap = useMinichefPools()

  if (type === PoolType.own) {
    miniChefStakingInfo = (miniChefStakingInfo || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }

  if (type === PoolType.superFarms) {
    miniChefStakingInfo = (miniChefStakingInfo || []).filter(item => (item?.rewardTokens?.length || 0) > 1)
  }

  return (
    <PoolListV2
      version="2"
      stakingInfos={miniChefStakingInfo}
      poolMap={poolMap}
      activeMenu={activeMenu}
      setMenu={(value: string) => setMenu(value)}
      menuItems={menuItems}
    />
  )
}

export default PoolV2

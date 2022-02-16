import React from 'react'
import { DoubleSideStakingInfo, useMinichefPools } from 'src/state/stake/hooks'
import PoolList from './PoolList'
import { PoolType } from '../index'

interface Props {
  type: string
  stakingInfos: DoubleSideStakingInfo[]
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolV2: React.FC<Props> = ({ type, stakingInfos, setMenu, activeMenu, menuItems }) => {
  const poolMap = useMinichefPools()

  if (type === PoolType.own) {
    stakingInfos = (stakingInfos || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }

  if (type === PoolType.superFarms) {
    stakingInfos = (stakingInfos || []).filter(item => (item?.rewardTokensAddress?.length || 0) > 0)
  }
  return (
    <PoolList
      version="2"
      stakingInfos={stakingInfos}
      poolMap={poolMap}
      activeMenu={activeMenu}
      setMenu={(value: string) => setMenu(value)}
      menuItems={menuItems}
    />
  )
}

export default PoolV2

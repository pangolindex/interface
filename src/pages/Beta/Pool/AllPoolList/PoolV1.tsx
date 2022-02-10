import React from 'react'
import { DoubleSideStakingInfo } from 'src/state/stake/hooks'
import PoolList from './PoolList'
import { PoolType } from '../index'
interface Props {
  type: string
  stakingInfos: DoubleSideStakingInfo[]
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolV1: React.FC<Props> = ({ type, stakingInfos, setMenu, activeMenu, menuItems }) => {
  if (type === PoolType.own) {
    stakingInfos = (stakingInfos || []).filter(stakingInfo => {
      return Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    })
  }

  return (
    <PoolList
      version="1"
      stakingInfos={stakingInfos}
      activeMenu={activeMenu}
      setMenu={(value: string) => setMenu(value)}
      menuItems={menuItems}
    />
  )
}

export default PoolV1

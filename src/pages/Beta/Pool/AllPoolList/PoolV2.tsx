import React from 'react'
import { useMinichefPools, MinichefStakingInfo } from 'src/state/stake/hooks'
import PoolListV2 from './PoolList/PoolListV2'
import { PoolType } from '../index'
import { useTraceUpdate } from 'src/hooks/useTraceUpdate'

interface Props {
  type: string
  miniChefStakingInfo: MinichefStakingInfo[]
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const PoolV2: React.FC<Props> = ({ type, setMenu, activeMenu, menuItems, miniChefStakingInfo }) => {
  const poolMap = useMinichefPools()

  useTraceUpdate('PoolV2', { type, setMenu, activeMenu, menuItems, miniChefStakingInfo })

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
      setMenu={setMenu}
      menuItems={menuItems}
    />
  )
}

export default PoolV2

import React from 'react'
import { ConcentratedLiquidity, PoolsUI } from '@pangolindex/components'
import { useParams } from 'react-router-dom'
import { POOL_MENU_LINK } from 'src/constants'
export type PoolProps = Record<'type', POOL_MENU_LINK>

const Pool = () => {
  const params = useParams<PoolProps>()

  if (params?.type === POOL_MENU_LINK.v2) {
    return <PoolsUI />
  }

  if (params?.type === POOL_MENU_LINK.concLiq) {
    return <ConcentratedLiquidity />
  }

  return <PoolsUI />
}
export default Pool

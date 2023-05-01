import React from 'react'
import { Elixir, PoolsUI } from '@pangolindex/components'
import { useParams } from 'react-router-dom'
import { POOL_MENU_LINK } from 'src/constants'
export type PoolProps = Record<'type', POOL_MENU_LINK>

const Pool = () => {
  const params = useParams<PoolProps>()

  if (params?.type === POOL_MENU_LINK.standard) {
    return <PoolsUI />
  }

  if (params?.type === POOL_MENU_LINK.elixir) {
    return <Elixir />
  }

  return <PoolsUI />
}
export default Pool

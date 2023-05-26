import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Elixir, PoolsUI, useTranslation } from '@pangolindex/components'
import { useNavigate, useParams } from 'react-router-dom'
import { MENU_LINK, POOL_MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'
import { shouldHideChildItem } from 'src/utils'
import { AlertTriangle } from 'react-feather'
export type PoolProps = Record<'type', POOL_MENU_LINK>

const PhishAlert = styled.div`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.red1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`

const Alert = () => {
  const { t } = useTranslation()

  return (
    <PhishAlert>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('elixir.auditWarning')}
      </div>
    </PhishAlert>
  )
}

const Pool = () => {
  const params = useParams<PoolProps>()
  const chainId = useChainId()
  const navigate = useNavigate()

  useEffect(() => {
    if (chainId && shouldHideChildItem(chainId, MENU_LINK.pool, params?.type as POOL_MENU_LINK)) {
      navigate('/')
    }
  }, [chainId, params?.type])

  if (params?.type === POOL_MENU_LINK.standard) {
    return <PoolsUI />
  }

  if (params?.type === POOL_MENU_LINK.elixir) {
    return (
      <>
        <Alert />
        <Elixir />
      </>
    )
  }

  return <PoolsUI />
}
export default Pool

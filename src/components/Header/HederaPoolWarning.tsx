import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AlertTriangle, X } from 'react-feather'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router-dom'
import { useChainId } from 'src/hooks'
import { ChainId } from '@pangolindex/sdk'

const Alert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`
const message = `The wHBAR rewards have already been replenished, check the "Your farms" tab, stake some liquidity in the pool
and click remove, this way your liquidity will be removed from the farm with your wHBAR rewards.`

export default function HederaPoolWarning() {
  const chainId = useChainId()
  const { pathname } = useLocation()

  const [isActive, setIsActive] = useState(chainId === ChainId.HEDERA_MAINNET && pathname === '/pool/standard')

  useEffect(() => {
    if (chainId === ChainId.HEDERA_MAINNET && pathname === '/pool/standard') {
      setIsActive(true)
    }
    if (isActive && pathname !== '/pool/standard') {
      setIsActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsActive, pathname, chainId])

  const onClose = useCallback(() => setIsActive(false), [setIsActive])

  return isMobile ? (
    <Alert isActive={isActive}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={64} />
        {message}
      </div>
      <StyledClose size={64} onClick={onClose} />
    </Alert>
  ) : (
    <Alert isActive={isActive}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} />
        {message}
      </div>
      <StyledClose size={12} onClick={onClose} />
    </Alert>
  )
}

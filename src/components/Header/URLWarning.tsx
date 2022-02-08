import React from 'react'
import styled from 'styled-components'
import { Text } from '@pangolindex/components'
import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { useIsBetaUI } from '../../hooks/useLocation'

const PhishAlert = styled.div<{ isActive: any }>`
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

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  const { t } = useTranslation()
  const isBeta = useIsBetaUI()
  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.makeSureURLWarning')}
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.pangolin.exchange</code>
        {!isBeta && (
          <Text as="a" href="#/beta/swap">
            <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>
              {t('header.tryOurNewBetaSite')}
            </code>
          </Text>
        )}
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname === 'app.pangolin.exchange' ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.alwaysMakeSureWarning')}
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.pangolin.exchange</code> -
        {t('header.bookmarkIt')}
        <Text as="a" href="/beta/swap">
          <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>
            {t('header.tryOurNewBetaSite')}
          </code>
        </Text>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}

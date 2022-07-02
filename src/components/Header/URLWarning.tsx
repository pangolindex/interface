import React from 'react'
import styled from 'styled-components'
import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

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

  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.makeSureURLWarning')}
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.pangolin.exchange</code>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname === 'app.pangolin.exchange' ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.alwaysMakeSureWarning')}
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.pangolin.exchange</code> -
        {t('header.bookmarkIt')}
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}

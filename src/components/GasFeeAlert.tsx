import React, { useContext } from 'react'
import Column, { AutoColumn } from './Column'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { AlertTriangle } from 'react-feather'
import { TYPE } from '../theme'
import { RowFixed } from './Row'
import { GAS_PRICE } from '../constants'
import { useTranslation } from '@pangolindex/components'

export const GasFee = styled(AutoColumn)`
  background-color: ${({ theme }) => transparentize(0.9, theme.primary1)};
  color: ${({ theme }) => theme.primary1};
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`

export default function GasFeeAlert() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <GasFee style={{ marginTop: '16px' }} justify="flex-start" gap={'0px'}>
      <RowFixed>
        <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
        <Column>
          <TYPE.main color={theme.primary1}>
            {t('gasFeeAlert.gasFeeReduction')}!<br />
          </TYPE.main>
          <TYPE.main color={theme.primary1}>
            {t('gasFeeAlert.transactionsNotAccept', { gasPrice: GAS_PRICE })}
          </TYPE.main>
        </Column>
      </RowFixed>
    </GasFee>
  )
}

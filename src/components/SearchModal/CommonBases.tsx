import React from 'react'
import { Text } from 'rebass'
import { Currency, currencyEquals, CAVAX, Token } from '@pangolindex/sdk'
import styled from 'styled-components'

import { SUGGESTED_BASES } from '../../constants'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'src/hooks'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
  onSelect,
  selectedCurrency
}: {
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const chainId = useChainId()
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          {t('searchModal.commonBases')}
        </Text>
        <QuestionHelper text={t('searchModal.tokensPairsHelper')} />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, CAVAX[chainId])) {
              onSelect(CAVAX[chainId])
            }
          }}
          disable={selectedCurrency === CAVAX[chainId]}
        >
          {chainId && (
            <CurrencyLogo currency={chainId && CAVAX[chainId]} style={{ marginRight: 8 }} chainId={chainId} />
          )}
          <Text fontWeight={500} fontSize={16}>
            AVAX
          </Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              {chainId && <CurrencyLogo currency={token} style={{ marginRight: 8 }} chainId={chainId} />}
              <Text fontWeight={500} fontSize={16}>
                {token.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}

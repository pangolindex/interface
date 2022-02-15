import { CurrencyAmount, Percent, JSBI } from '@antiyro/sdk'
import React, { useMemo, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { warningSeverity } from 'src/utils/prices'
import { Text } from '@pangolindex/components'

export function FiatValue({
  fiatValue,
  priceImpact
}: {
  fiatValue: CurrencyAmount | null | undefined
  priceImpact?: Percent
}) {
  const theme = useContext(ThemeContext)
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return theme.green1
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return theme.text4
    if (severity < 3) return theme.yellow1
    return theme.red1
  }, [priceImpact, theme.green1, theme.red1, theme.text4, theme.yellow1])

  return (
    <Text fontSize={14} color={fiatValue ? 'text2' : 'text4'} ml={10}>
      {fiatValue ? '~' : ''}${fiatValue ? fiatValue?.toSignificant(6, { groupSeparator: ',' }) : '-'}
      {priceImpact ? (
        <span style={{ color: priceImpactColor }}> ({priceImpact.multiply(JSBI.BigInt(-1)).toSignificant(3)}%)</span>
      ) : null}
    </Text>
  )
}

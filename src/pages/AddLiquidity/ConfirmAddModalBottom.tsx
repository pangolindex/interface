import { Currency, CurrencyAmount, Fraction, Percent } from '@pangolindex/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from '@pangolindex/components'
import { useChainId } from 'src/hooks'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const chainId = useChainId()
  return (
    <>
      <RowBetween>
        <TYPE.body>
          {currencies[Field.CURRENCY_A]?.symbol} {t('addLiquidity.deposited')}
        </TYPE.body>
        <RowFixed>
          {chainId && (
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} chainId={chainId} />
          )}
          <TYPE.body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>
          {currencies[Field.CURRENCY_B]?.symbol} {t('addLiquidity.deposited')}
        </TYPE.body>
        <RowFixed>
          {chainId && (
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} chainId={chainId} />
          )}
          <TYPE.body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{t('addLiquidity.rates')}</TYPE.body>
        <TYPE.body>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </TYPE.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
          currencies[Field.CURRENCY_A]?.symbol
        }`}
      </RowBetween>
      <RowBetween>
        <TYPE.body> {t('addLiquidity.shareOfPool')}</TYPE.body>
        <TYPE.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('addLiquidity.createPoolSupply') : t('addLiquidity.confirmSupply')}
        </Text>
      </ButtonPrimary>
    </>
  )
}

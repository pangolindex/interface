import { Text } from '@pangolindex/components'
import { Trade, TradeType } from '@pangolindex/sdk'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from 'src/constants'
import { Field } from 'src/state/swap/actions'
import { useUserSlippageTolerance } from 'src/state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'src/utils/prices'
import { ContentBox, DataBox, ValueText } from './styled'

type Props = { trade: Trade }

const SwapDetailInfo: React.FC<Props> = ({ trade }) => {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  const amount = isExactIn
    ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ?? '-'
    : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'

  const priceImpact = priceImpactWithoutFee
    ? priceImpactWithoutFee.lessThan(ONE_BIPS)
      ? '<0.01%'
      : `${priceImpactWithoutFee.toFixed(2)}%`
    : '-'

  const lpFee = realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'

  const renderRow = (label: string, value: string, showSeverity?: boolean) => {
    return (
      <DataBox key={label}>
        <Text color="text4" fontSize={14}>
          {label}
        </Text>

        <ValueText fontSize={14} severity={showSeverity ? warningSeverity(priceImpactWithoutFee) : -1}>
          {value}
        </ValueText>
      </DataBox>
    )
  }

  return (
    <ContentBox>
      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE &&
        renderRow(t('swapPage.slippageTolerance'), `${allowedSlippage / 100}%`)}
      {renderRow(isExactIn ? t('swap.minimumReceived') : t('swap.maximumSold'), amount)}
      {renderRow(t('swap.priceImpact'), priceImpact, true)}
      {renderRow(t('swap.liquidityProviderFee'), lpFee)}
    </ContentBox>
  )
}

export default SwapDetailInfo

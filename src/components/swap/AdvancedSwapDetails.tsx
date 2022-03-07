import { ChainId, Trade, TradeType } from '@pangolindex/sdk'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from 'src/hooks'

function TradeSummary({
  trade,
  allowedSlippage,
  chainId
}: {
  trade: Trade
  allowedSlippage: number
  chainId: ChainId
}) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(
    chainId ? chainId : ChainId.AVALANCHE,
    trade
  )
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage,
    chainId ? chainId : ChainId.AVALANCHE
  )
  const { t } = useTranslation()

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? t('swap.minimumReceived') : t('swap.maximumSold')}
            </TYPE.black>
            <QuestionHelper text={t('swap.transactionRevertHelper')} />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {t('swap.priceImpact')}
            </TYPE.black>
            <QuestionHelper text={t('swap.priceImpactHelper')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {t('swap.liquidityProviderFee')}
            </TYPE.black>
            <QuestionHelper text={t('swap.liquidityProviderHelper')} />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text1}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()
  const { chainId } = useActiveWeb3React()
  const showRoute = Boolean(trade && trade.route.path.length > 2)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      {trade && chainId && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} chainId={chainId} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('swap.route')}
                  </TYPE.black>
                  <QuestionHelper text={t('swap.routingHelper')} />
                </RowFixed>
                <SwapRoute trade={trade} chainId={chainId} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}

import { Text } from '@pangolindex/components'
import { formatUnits } from '@ethersproject/units'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { INITIAL_ALLOWED_SLIPPAGE } from 'src/constants'
import { useChainId } from 'src/hooks'
import { ContentBox, DataBox, ValueText } from './styled'
import { useGelatoLimitOrders, useGelatoLimitOrdersLib, useGasOverhead } from '@gelatonetwork/limit-orders-react'
import { TokenAmount } from '@antiyro/sdk'

type Props = { trade: any }

const LimitOrderDetailInfo: React.FC<Props> = ({ trade }) => {
  const { t } = useTranslation()

  const chainId = useChainId()

  const {
    derivedOrderInfo: { parsedAmounts, rawAmounts }
  } = useGelatoLimitOrders()

  const { gasPrice, realExecutionPriceAsString } = useGasOverhead(parsedAmounts.input, parsedAmounts.output)
  const priceText = `${'1 ' + parsedAmounts?.input?.currency.symbol + ' = ' + realExecutionPriceAsString ?? '-'} ${
    parsedAmounts?.output?.currency.symbol
  }`

  const formattedGasPrice = gasPrice ? `${parseFloat(formatUnits(gasPrice, 'gwei')).toFixed(0)} GWEI` : '-'

  const library = useGelatoLimitOrdersLib()

  const outputAmount = parsedAmounts.output

  const rawOutputAmount = rawAmounts.output ?? '0'

  const { minReturn, slippagePercentage, gelatoFeePercentage } = useMemo(() => {
    if (!outputAmount || !library || !chainId)
      return {
        minReturn: undefined,
        slippagePercentage: undefined,
        gelatoFeePercentage: undefined
      }

    const { minReturn } = library.getFeeAndSlippageAdjustedMinReturn(rawOutputAmount)

    const slippagePercentage = library.slippageBPS / 100
    const gelatoFeePercentage = library.gelatoFeeBPS / 100

    //const minReturnParsed = CurrencyAmount.fromRawAmount(trade?.outputAmount?.currency, minReturn)
    const minReturnParsed = new TokenAmount(trade?.outputAmount?.currency, minReturn)
    return {
      minReturn: minReturnParsed,
      slippagePercentage,
      gelatoFeePercentage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputAmount, chainId, library, rawOutputAmount])

  const renderRow = (label: string, value: string) => {
    return (
      <DataBox key={label}>
        <Text color="text4" fontSize={14}>
          {label}
        </Text>

        <ValueText fontSize={14}>{value}</ValueText>
      </DataBox>
    )
  }

  return (
    <ContentBox>
      {renderRow('Gas Price', `${formattedGasPrice}`)}
      {renderRow('Real Execution Price', `${realExecutionPriceAsString ? `${priceText}` : '-'}`)}
      {renderRow(t('swapPage.gelatoFee'), `${gelatoFeePercentage ? `${gelatoFeePercentage}` : '-'}%`)}
      {slippagePercentage !== INITIAL_ALLOWED_SLIPPAGE &&
        renderRow(t('swapPage.slippageTolerance'), `${slippagePercentage ? `${slippagePercentage}` : '-'}%`)}
      {renderRow(
        minReturn ? t('swap.minimumReceived') : t('swap.maximumSold'),
        minReturn ? `${minReturn.toSignificant(4)} ${outputAmount ? outputAmount.currency.symbol : '-'}` : '-'
      )}
    </ContentBox>
  )
}

export default LimitOrderDetailInfo

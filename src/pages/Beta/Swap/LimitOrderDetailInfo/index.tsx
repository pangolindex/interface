import { Text } from '@pangolindex/components'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { INITIAL_ALLOWED_SLIPPAGE } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { ContentBox, DataBox, ValueText } from './styled'
import { useGelatoLimitOrders, useGelatoLimitOrdersLib } from '@gelatonetwork/limit-orders-react'
import { GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import { TokenAmount } from '@pangolindex/sdk'

type Props = { trade: any }

const LimitOrderDetailInfo: React.FC<Props> = ({ trade }) => {
  const { t } = useTranslation()

  const { chainId } = useActiveWeb3React()

  const {
    derivedOrderInfo: { parsedAmounts, rawAmounts }
  } = useGelatoLimitOrders()

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

    const slippagePercentage = GelatoLimitOrders.slippageBPS / 100
    const gelatoFeePercentage = GelatoLimitOrders.gelatoFeeBPS / 100

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

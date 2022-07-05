import React from 'react'
import { Text, Box, useGelatoLimitOrderDetail, LimitOrderInfo } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { DesktopRowWrapper } from './styleds'

type Props = {
  order: LimitOrderInfo
  onClick: () => void
  isSelected: boolean
}

const LimitOrderRow: React.FC<Props> = ({ order, onClick, isSelected }) => {
  const { t } = useTranslation()
  const { currency0, currency1, inputAmount, outputAmount } = useGelatoLimitOrderDetail(order)

  return (
    <DesktopRowWrapper isSelected={isSelected} onClick={onClick}>
      <Text color="text1" fontSize={12} fontWeight={500} marginLeft={'6px'}>
        {t('swapPage.cancelLimitOrder', {
          outputCurrency: currency1?.symbol,
          inputCurrency: currency0?.symbol
        })}
      </Text>

      <Box textAlign="right" minWidth={30} height={'100%'}>
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
          <Text color="text1" fontSize={12} fontWeight={500}>
            {inputAmount ? inputAmount.toSignificant(4) : '-'} / {outputAmount ? outputAmount.toSignificant(4) : '-'}
          </Text>

          <Text color={'primary'} fontSize={12} fontWeight={500}>
            {order?.status}
            {order?.pending && `(P)`}
          </Text>
        </Box>
      </Box>
    </DesktopRowWrapper>
  )
}

export default LimitOrderRow

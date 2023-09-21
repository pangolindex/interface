import React from 'react'
import { useGelatoLimitOrderDetail, LimitOrderInfo } from '@honeycomb-finance/swap'
import { Text, Box, Button, DoubleCurrencyLogo, Stat } from '@honeycomb-finance/core'
import { useTranslation } from '@honeycomb-finance/shared'
import { Currency } from '@pangolindex/sdk'
import { MobileRowWrapper, StatWrapper } from './styleds'

type Props = {
  order: LimitOrderInfo
  onClick: () => void
  isSelected: boolean
  onClickCancelOrder: () => void
}

const MobileLimitOrderRow: React.FC<Props> = ({ order, onClick, isSelected, onClickCancelOrder }) => {
  const { t } = useTranslation()
  const { currency0, currency1, inputAmount, outputAmount, executionPrice } = useGelatoLimitOrderDetail(order)

  return (
    <Box>
      <MobileRowWrapper isSelected={isSelected} onClick={onClick}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <DoubleCurrencyLogo size={24} currency0={currency0 as Currency} currency1={currency1 as Currency} />

            <Text color="text1" fontSize={18} fontWeight={500} lineHeight="30px">
              {currency0?.symbol}/{currency1?.symbol}
            </Text>
          </Box>

          <Box marginLeft={10}>
            <Text color="text1" fontSize={16} fontWeight={500}>
              {inputAmount ? inputAmount.toSignificant(4) : '-'} / {outputAmount ? outputAmount.toSignificant(4) : '-'}
            </Text>
          </Box>
        </Box>

        {isSelected && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text color="text1" fontSize={16} fontWeight={500}>
                {t('swapPage.cancelLimitOrder', {
                  outputCurrency: currency1?.symbol,
                  inputCurrency: currency0?.symbol
                })}
              </Text>

              {order?.status === 'open' && (
                <Button
                  variant="plain"
                  backgroundColor="darkSilver"
                  color="white"
                  padding="0px 10px"
                  height="32px"
                  width="auto"
                  onClick={() => onClickCancelOrder()}
                >
                  {t('swapPage.cancelOrder')}
                </Button>
              )}
            </Box>
            <StatWrapper>
              <Box>
                <Stat
                  title={t('swapPage.inputAmount')}
                  stat={inputAmount ? inputAmount.toSignificant(4) : '-'}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={18}
                  titleColor="text2"
                  currency={currency0 as Currency}
                />
              </Box>

              <Box>
                <Stat
                  title={t('swapPage.outputAmount')}
                  stat={outputAmount ? outputAmount.toSignificant(4) : '-'}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={18}
                  titleColor="text2"
                  currency={currency1 as Currency}
                />
              </Box>
            </StatWrapper>

            <StatWrapper>
              <Box>
                <Stat
                  title={t('swap.price')}
                  stat={executionPrice ? executionPrice.toSignificant(4) : '-'}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={18}
                  titleColor="text2"
                />
              </Box>

              <Box>
                <Stat
                  title={t('swapPage.status')}
                  stat={`${order?.status} ${order?.pending ? `(${t('web3Status.pending')})` : ''}`}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={18}
                  titleColor="text2"
                />
              </Box>
            </StatWrapper>
          </Box>
        )}
      </MobileRowWrapper>
    </Box>
  )
}

export default MobileLimitOrderRow

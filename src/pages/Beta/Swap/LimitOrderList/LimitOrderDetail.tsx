import React from 'react'
import {
  Text,
  Box,
  DoubleCurrencyLogo,
  Button,
  useGelatoLimitOrderDetail,
  LimitOrderInfo
} from '@pangolindex/components'
import { Currency } from '@pangolindex/sdk'
import { SelectedCoinInfo, StatWrapper } from './styleds'
import { useTranslation } from 'react-i18next'
import Stat from 'src/components/Stat'

type Props = {
  order: LimitOrderInfo
  onClickCancelOrder: () => void
}

const LimitOrderDetail: React.FC<Props> = ({ order, onClickCancelOrder }) => {
  const { t } = useTranslation()

  const { currency0, currency1, inputAmount, outputAmount, executionPrice } = useGelatoLimitOrderDetail(order)

  return (
    <Box>
      <SelectedCoinInfo>
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={48} currency0={currency0 as Currency} currency1={currency1 as Currency} />

          <Box marginLeft={10}>
            <Text color="text1" fontSize="16px" fontWeight={500} lineHeight="30px">
              {currency0?.symbol}/{currency1?.symbol}
            </Text>
            <Text color="platinum" fontSize="12px">
              {t('header.buy')} {currency1?.symbol}
            </Text>
          </Box>
        </Box>
      </SelectedCoinInfo>

      <StatWrapper>
        <Box>
          <Stat
            title={t('swapPage.inputAmount')}
            stat={inputAmount ? inputAmount.toSignificant(4) : '-'}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={14}
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
            statFontSize={14}
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
            statFontSize={14}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('swapPage.status')}
            stat={`${order?.status} ${order?.pending ? `(${t('web3Status.pending')})` : ''}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={14}
            titleColor="text2"
          />
        </Box>
      </StatWrapper>

      {order?.status === 'open' && (
        <Box textAlign="center" mt={10}>
          <Button
            variant="plain"
            backgroundColor="darkSilver"
            color="white"
            padding="0px 10px"
            height="32px"
            onClick={() => onClickCancelOrder()}
          >
            {t('swapPage.cancelOrder')}
          </Button>
        </Box>
      )}
    </Box>
  )
}
export default LimitOrderDetail

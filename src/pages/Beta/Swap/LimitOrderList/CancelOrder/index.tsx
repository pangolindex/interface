import React, { useState, useCallback } from 'react'
import {
  Box,
  Text,
  Button,
  useGelatoLimitOrderDetail,
  Order,
  useGelatoLimitOrdersHandlers,
  useTranslation,
  useActiveWeb3React
} from '@pangolindex/components'
import { CancelOrderRoot, PendingWrapper, Root, Footer, Header } from './styleds'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/svg/blue-loader.svg'
import TransactionSubmitted from 'src/components/Beta/TransactionSubmitted'

interface ClaimProps {
  order: Order
  onClose: () => void
}
const CancelOrder = ({ order, onClose }: ClaimProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const { handleLimitOrderCancellation } = useGelatoLimitOrdersHandlers()

  const [{ cancellationErrorMessage, attemptingTxn, txHash }, setCancellationState] = useState<{
    attemptingTxn: boolean
    cancellationErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    cancellationErrorMessage: undefined,
    txHash: undefined
  })

  const handleConfirmDismiss = useCallback(() => {
    setCancellationState({
      attemptingTxn: false,
      cancellationErrorMessage,
      txHash
    })
    onClose()
  }, [cancellationErrorMessage, txHash, onClose, setCancellationState])

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }

  const { currency0, currency1, inputAmount, outputAmount, executionPrice } = useGelatoLimitOrderDetail(order)

  const handleCancellation = useCallback(() => {
    if (!handleLimitOrderCancellation) {
      return
    }

    setCancellationState({
      attemptingTxn: true,
      cancellationErrorMessage: undefined,
      txHash: undefined
    })

    const orderDetails =
      currency0?.symbol && currency1?.symbol && inputAmount && outputAmount
        ? {
            inputTokenSymbol: currency0?.symbol,
            outputTokenSymbol: currency1?.symbol,
            inputAmount: inputAmount.toSignificant(4),
            outputAmount: outputAmount.toSignificant(4)
          }
        : undefined

    handleLimitOrderCancellation(order, orderDetails)
      .then(({ hash }) => {
        setCancellationState({
          attemptingTxn: false,
          cancellationErrorMessage: undefined,
          txHash: hash
        })
      })
      .catch(err => {
        setCancellationState({
          attemptingTxn: false,
          cancellationErrorMessage: err.message,
          txHash: undefined
        })
      })
  }, [handleLimitOrderCancellation, currency0, currency1, inputAmount, outputAmount, order])

  return (
    <CancelOrderRoot>
      {!attemptingTxn && !txHash && (
        <Root>
          <Header>
            <Box>
              <Box textAlign="center">
                <Text fontSize="20px" fontWeight={500} lineHeight="42px" color="text1">
                  {t('swapPage.cancelLimitOrder', {
                    outputCurrency: `${outputAmount ? outputAmount.toSignificant(4) : '-'} ${currency1?.symbol}`,
                    inputCurrency: `${inputAmount ? inputAmount.toSignificant(4) : '-'} ${currency0?.symbol}`
                  })}
                </Text>
              </Box>

              <Text fontSize="14px" color="text2" textAlign="center">
                {t('swapPage.executionPrice')} : {executionPrice ? executionPrice.toSignificant(4) : '-'}
              </Text>
            </Box>
          </Header>
          <Footer>
            <Box my={'10px'}>
              <Button variant="primary" onClick={handleCancellation}>
                {(error || cancellationErrorMessage) ?? t('swapPage.cancelOrder')}
              </Button>
            </Box>
          </Footer>
        </Root>
      )}

      {attemptingTxn && !txHash && (
        <PendingWrapper>
          <Box mb={'15px'}>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </Box>
          <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
            {t('swapPage.cancellingOrder')}
          </Text>
          <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
            {t('swapPage.cancelLimitOrder', {
              outputCurrency: `${currency1?.symbol} ${outputAmount ? outputAmount.toSignificant(4) : '-'}`,
              inputCurrency: `${currency0?.symbol} ${inputAmount ? inputAmount.toSignificant(4) : '-'}`
            })}
          </Text>
        </PendingWrapper>
      )}
      {txHash && <TransactionSubmitted onClose={handleConfirmDismiss} hash={txHash} />}
    </CancelOrderRoot>
  )
}
export default CancelOrder

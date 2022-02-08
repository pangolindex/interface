import React, { useContext, useState, useCallback } from 'react'
import { ArrowDown, AlertTriangle, ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Token, Trade, TradeType, CAVAX } from '@pangolindex/sdk'
import { CurrencyLogo, Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import { getEtherscanLink } from 'src/utils'
import Drawer from 'src/components/Drawer'
import {
  TokenRow,
  Header,
  Footer,
  Root,
  PriceUpdateBlock,
  PendingWrapper,
  ErrorWrapper,
  ErrorBox,
  SubmittedWrapper,
  Link
} from './styled'
import LimitOrderDetailInfo from '../LimitOrderDetailInfo'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { useActiveWeb3React } from 'src/hooks'
import { useGelatoLimitOrders } from '@gelatonetwork/limit-orders-react'
import { shortenAddress, isAddress } from 'src/utils'
import { FiatValue } from './FiateValue'
import { computeFiatValuePriceImpact } from 'src/utils/computeFiatValuePriceImpact'
import useUSDCPrice from 'src/utils/useUSDCPrice'

interface Props {
  isOpen: boolean
  trade: Trade
  originalTrade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onClose: () => void
}

const ConfirmLimitOrderDrawer: React.FC<Props> = props => {
  const {
    isOpen,
    onClose,
    trade,
    onAcceptChanges,
    recipient,
    onConfirm,
    attemptingTxn,
    swapErrorMessage,
    txHash
  } = props
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const {
    derivedOrderInfo: { price, parsedAmounts }
  } = useGelatoLimitOrders()

  let formattedPrice: any
  try {
    formattedPrice = showInverted ? price?.toSignificant(4) : price?.invert()?.toSignificant(4)
  } catch (error) {
    formattedPrice = '0'
  }

  const label = showInverted ? `${price?.quoteCurrency?.symbol}` : `${price?.baseCurrency?.symbol} `
  const labelInverted = showInverted ? `${price?.baseCurrency?.symbol} ` : `${price?.quoteCurrency?.symbol}`

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])

  const showAcceptChanges = false

  const inputAmount = parsedAmounts.input
  const outputAmount = parsedAmounts.output

  const inputCurrency1 = inputAmount?.currency as any
  const outputCurrency1 = outputAmount?.currency as any

  const inputTokenInfo = inputCurrency1?.tokenInfo
  const outputTokenInfo = outputCurrency1?.tokenInfo

  const inputCurrency =
    inputCurrency1 && inputCurrency1?.symbol === CAVAX.symbol
      ? CAVAX
      : inputTokenInfo && inputTokenInfo.symbol === CAVAX.symbol
      ? CAVAX
      : new Token(
          inputTokenInfo?.chainId,
          inputTokenInfo?.address,
          inputTokenInfo?.decimals,
          inputTokenInfo?.symbol,
          inputTokenInfo?.name
        )

  const outputCurrency =
    outputCurrency1 && outputCurrency1?.symbol === CAVAX.symbol
      ? CAVAX
      : outputTokenInfo && outputTokenInfo?.symbol === CAVAX.symbol
      ? CAVAX
      : outputTokenInfo
      ? new Token(
          outputTokenInfo?.chainId,
          outputTokenInfo?.address,
          outputTokenInfo?.decimals,
          outputTokenInfo?.symbol,
          outputTokenInfo?.name
        )
      : undefined

  const fiatValueInput = useUSDCPrice(inputCurrency)
  const fiatValueOutput = useUSDCPrice(outputCurrency)

  if (!inputAmount || !outputAmount) return null

  // text to show while loading
  const pendingText = `${t('swapPage.submittingOrderToSwap')} ${trade?.inputAmount?.toSignificant(6)} ${
    inputCurrency?.symbol
  } ${t('swapPage.for')} ${trade?.outputAmount?.toSignificant(6)} ${outputCurrency?.symbol}`

  const ConfirmContent = (
    <Root>
      <Header>
        <TokenRow>
          <CurrencyLogo currency={inputCurrency} size={'24px'} />
          <Text
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text1'}
            style={{ marginLeft: '12px' }}
          >
            {inputAmount.toSignificant(6)}
          </Text>
          <Text fontSize={24} fontWeight={500} color="text1" style={{ marginLeft: '10px' }}>
            {inputCurrency?.symbol}
          </Text>
        </TokenRow>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
        <TokenRow>
          <CurrencyLogo currency={outputCurrency} size={'24px'} />

          <Box display="flex" alignItems="center">
            <Text
              fontSize={24}
              fontWeight={500}
              style={{ marginLeft: '12px' }}
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT ? 'primary' : 'text1'}
            >
              {outputAmount.toSignificant(6)}
            </Text>

            <FiatValue
              fiatValue={fiatValueOutput as any}
              priceImpact={computeFiatValuePriceImpact(fiatValueInput as any, fiatValueOutput as any) as any}
            />
          </Box>
          <Text fontSize={24} fontWeight={500} color="text1" style={{ marginLeft: '10px' }}>
            {outputCurrency?.symbol}
          </Text>
        </TokenRow>
        {showAcceptChanges && (
          <PriceUpdateBlock>
            <Text color={'text1'} fontSize={14}>
              {t('swap.priceUpdated')}
            </Text>
            <Button onClick={onAcceptChanges} variant="primary" width={150} padding="5px 10px">
              {t('swap.accept')}
            </Button>
          </PriceUpdateBlock>
        )}

        <Box
          mt={'30px'}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={flipPrice}
          style={{ cursor: 'pointer' }}
        >
          <Text color={'text1'} fontSize={16}>
            {t('swapPage.limitPrice')}
          </Text>
          <Text color={'text1'} fontSize={16}>
            {text}
          </Text>
        </Box>
        <Box mt={'15px'}>
          <Text color={'text1'} fontSize={16}>
            {t('swapPage.outputWillBeSentTo')}{' '}
            <b title={recipient || ''}>
              {isAddress(recipient || '') ? shortenAddress(recipient || '') : recipient || ''}
            </b>
          </Text>
        </Box>
      </Header>
      <Footer>
        <LimitOrderDetailInfo trade={trade} />
        <Box my={'10px'}>
          <Button variant="primary" onClick={onConfirm} isDisabled={showAcceptChanges}>
            {t('swapPage.confirmOrder')}
          </Button>
        </Box>
      </Footer>
    </Root>
  )

  const PendingContent = (
    <PendingWrapper>
      <Box mb={'15px'}>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </Box>
      <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
        {t('transactionConfirmation.waitingConfirmation')}
      </Text>
      <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
        {pendingText}
      </Text>
      <Text fontSize={12} color="text1" textAlign="center">
        {t('transactionConfirmation.confirmTransaction')}
      </Text>
    </PendingWrapper>
  )

  const ErroContent = (
    <ErrorWrapper>
      <ErrorBox>
        <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
        <Text fontWeight={500} fontSize={16} color={'red1'} style={{ textAlign: 'center', width: '85%' }}>
          {swapErrorMessage}
        </Text>
      </ErrorBox>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.dismiss')}
      </Button>
    </ErrorWrapper>
  )

  const SubmittedContent = (
    <SubmittedWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
        <Box flex="1" display="flex" alignItems="center">
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('transactionConfirmation.transactionSubmitted')}
        </Text>
        {chainId && txHash && (
          <Link
            as="a"
            fontWeight={500}
            fontSize={14}
            color={'primary'}
            href={getEtherscanLink(chainId, txHash, 'transaction')}
          >
            {t('transactionConfirmation.viewExplorer')}
          </Link>
        )}
      </Box>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.close')}
      </Button>
    </SubmittedWrapper>
  )

  return (
    <Drawer
      title={swapErrorMessage || txHash || attemptingTxn ? '' : t('swapPage.confirmOrder')}
      isOpen={isOpen}
      onClose={onClose}
    >
      {swapErrorMessage ? ErroContent : txHash ? SubmittedContent : attemptingTxn ? PendingContent : ConfirmContent}
    </Drawer>
  )
}
export default ConfirmLimitOrderDrawer

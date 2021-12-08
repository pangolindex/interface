import React, { useContext, useMemo } from 'react'
import { ArrowDown, AlertTriangle, ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Trade, TradeType } from '@pangolindex/sdk'
import { CurrencyLogo, Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import { getEtherscanLink, tradeMeaningfullyDiffers } from 'src/utils'
import Drawer from '../Drawer'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'src/utils/prices'
import { Field } from 'src/state/swap/actions'
import {
  TokenRow,
  Header,
  OutputText,
  Footer,
  Root,
  PriceUpdateBlock,
  PendingWrapper,
  ErrorWrapper,
  ErrorBox,
  SubmittedWrapper,
  Link
} from './styled'
import SwapDetailInfo from '../SwapDetailInfo'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { useActiveWeb3React } from 'src/hooks'

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

const ConfirmSwapDrawer: React.FC<Props> = props => {
  const {
    isOpen,
    onClose,
    trade,
    originalTrade,
    allowedSlippage,
    onAcceptChanges,
    onConfirm,
    attemptingTxn,
    swapErrorMessage,
    txHash
  } = props

  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    trade?.inputAmount?.currency?.symbol
  } for ${trade?.outputAmount?.toSignificant(6)} ${trade?.outputAmount?.currency?.symbol}`

  const ConfirmContent = (
    <Root>
      <Header>
        <TokenRow>
          <CurrencyLogo currency={trade.inputAmount.currency} size={'24px'} />
          <Text
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary1' : 'text1'}
            style={{ marginLeft: '12px' }}
          >
            {trade.inputAmount.toSignificant(6)}
          </Text>
          <Text fontSize={24} fontWeight={500} color="text1" style={{ marginLeft: '10px' }}>
            {trade.inputAmount.currency.symbol}
          </Text>
        </TokenRow>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
        <TokenRow>
          <CurrencyLogo currency={trade.outputAmount.currency} size={'24px'} />
          <Text
            fontSize={24}
            fontWeight={500}
            style={{ marginLeft: '12px' }}
            color={
              priceImpactSeverity > 2
                ? 'red1'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? 'primary1'
                : 'text1'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </Text>
          <Text fontSize={24} fontWeight={500} color="text1" style={{ marginLeft: '10px' }}>
            {trade.outputAmount.currency.symbol}
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
        <Box mt={'15px'}>
          {trade.tradeType === TradeType.EXACT_INPUT ? (
            <OutputText color="text2">
              {t('swap.outputEstimated')}
              <b>
                {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
              </b>
              {t('swap.transactionRevert')}
            </OutputText>
          ) : (
            <OutputText color="text2">
              {t('swap.inputEstimated')}
              <b>
                {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
              </b>
              {t('swap.transactionRevert')}
            </OutputText>
          )}
        </Box>
      </Header>
      <Footer>
        <SwapDetailInfo trade={trade} />
        <Box my={'10px'}>
          <Button variant="primary" onClick={onConfirm} isDisabled={showAcceptChanges}>
            {priceImpactSeverity > 2 ? t('swap.swapAnyway') : t('swap.confirmSwap')}
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
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('transactionConfirmation.transactionSubmitted')}
        </Text>
        {chainId && txHash && (
          <Link
            as="a"
            fontWeight={500}
            fontSize={14}
            color={'primary1'}
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
      title={swapErrorMessage || txHash || attemptingTxn ? '' : t('swap.confirmSwap')}
      isOpen={isOpen}
      onClose={onClose}
    >
      {swapErrorMessage ? ErroContent : txHash ? SubmittedContent : attemptingTxn ? PendingContent : ConfirmContent}
    </Drawer>
  )
}
export default ConfirmSwapDrawer

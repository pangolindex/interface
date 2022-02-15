import React, { useContext } from 'react'
import { ArrowUpCircle, Plus } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Currency, CurrencyAmount, Pair, Percent, TokenAmount } from '@antiyro/sdk'
import { Text, Box, Button, CurrencyLogo, DoubleCurrencyLogo } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import Drawer from 'src/components/Drawer'
import {
  PendingWrapper,
  SubmittedWrapper,
  ConfirmWrapper,
  CurrencyWithLogo,
  ConfirmTop,
  CurrencySymbol,
  CurrencyValue,
  ConfirmBottom,
  Link
} from './styled'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { Field } from 'src/state/burn/actions'
import { useActiveWeb3React } from 'src/hooks'
import { getEtherscanLink } from 'src/utils'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  onClose: () => void
  parsedAmounts: {
    LIQUIDITY_PERCENT: Percent
    LIQUIDITY?: TokenAmount | undefined
    CURRENCY_A?: CurrencyAmount | undefined
    CURRENCY_B?: CurrencyAmount | undefined
  }
  allowedSlippage: number
  pair?: Pair | null
  currencyB: Currency | undefined
  currencyA: Currency | undefined
  onConfirm: () => void
  onComplete: () => void
}

const ConfirmRemoveDrawer: React.FC<Props> = props => {
  const {
    isOpen,
    onClose,
    attemptingTxn,
    txHash,
    parsedAmounts,
    pair,
    allowedSlippage,
    onConfirm,
    currencyA,
    currencyB,
    onComplete
  } = props

  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  // TODO: i18n
  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencyA?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const ConfirmContent = (
    <ConfirmWrapper>
      <ConfirmTop>
        <Box display="flex" justifyContent="space-between">
          <CurrencyValue>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</CurrencyValue>
          <CurrencyWithLogo>
            <CurrencyLogo currency={currencyA} size="20px" />
            <CurrencySymbol>{currencyA?.symbol}</CurrencySymbol>
          </CurrencyWithLogo>
        </Box>
        <Box>
          <Plus size="16" color={theme.text2} />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <CurrencyValue>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</CurrencyValue>
          <CurrencyWithLogo>
            <CurrencyLogo currency={currencyB} size="20px" />
            <CurrencySymbol>{currencyB?.symbol}</CurrencySymbol>
          </CurrencyWithLogo>
        </Box>
        <Text fontStyle="italic" fontSize="13px" color="text4">
          Output is estimated. If the price changes by more than {allowedSlippage / 100}% your transaction will revert.
        </Text>
      </ConfirmTop>
      <ConfirmBottom>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text fontSize="15px" color="text4">
            {'PGL ' + currencyA?.symbol + '/' + currencyB?.symbol} Burned
          </Text>
          <CurrencyWithLogo>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={20} />
            <Text fontSize="15px" color="text1">
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </CurrencyWithLogo>
        </Box>
        {pair && (
          <Box display="flex" justifyContent="space-between" mt="10px">
            <Text color="text4" fontSize="15px">
              {t('removeLiquidity.price')}
            </Text>
            <Box>
              <Text fontSize="15px" color={'text1'}>
                1 {currencyA?.symbol} = {pair?.token0 ? pair.priceOf(pair?.token0).toSignificant(6) : '-'}{' '}
                {currencyB?.symbol}
              </Text>
              <Text fontSize="15px" color={'text1'}>
                1 {currencyB?.symbol} = {pair?.token1 ? pair.priceOf(pair?.token1).toSignificant(6) : '-'}{' '}
                {currencyA?.symbol}
              </Text>
            </Box>
          </Box>
        )}
        <Box flex="1" />
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </ConfirmBottom>
    </ConfirmWrapper>
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
      <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
        {t('transactionConfirmation.confirmTransaction')}
      </Text>
    </PendingWrapper>
  )

  const SubmittedContent = (
    <SubmittedWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'} flex="1">
        <Box flex="1" display="flex" alignItems="center">
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('earn.transactionSubmitted')}
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
      <Button variant="primary" onClick={onComplete}>
        {t('transactionConfirmation.close')}
      </Button>
    </SubmittedWrapper>
  )

  return (
    <Drawer title={!attemptingTxn ? t('addLiquidity.willReceive') : ''} isOpen={isOpen} onClose={onClose}>
      {attemptingTxn ? (txHash ? SubmittedContent : PendingContent) : ConfirmContent}
    </Drawer>
  )
}
export default ConfirmRemoveDrawer

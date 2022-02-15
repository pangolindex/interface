import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react'
import ReactGA from 'react-ga'
import { RefreshCcw } from 'react-feather'
import { Text, Box, Button } from '@pangolindex/components'
import { Token, Trade, JSBI, CurrencyAmount, TokenAmount, ChainId } from '@antiyro/sdk'
import { ThemeContext } from 'styled-components'
import RetryDrawer from '../../RetryDrawer'
import SelectTokenDrawer from '../../SelectTokenDrawer'
import ConfirmSwapDrawer from '../../ConfirmSwapDrawer'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState, useDefaultsFromURLSearch } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'
import { useCurrency } from 'src/hooks/Tokens'
import useWrapCallback, { WrapType } from 'src/hooks/useWrapCallback'
import useENS from 'src/hooks/useENS'
import useToggledVersion, { Version } from 'src/hooks/useToggledVersion'
import { useTranslation } from 'react-i18next'
import { ApprovalState, useApproveCallbackFromTrade } from 'src/hooks/useApproveCallback'
import { useActiveWeb3React } from 'src/hooks'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'src/state/user/hooks'
import { maxAmountSpend } from 'src/utils/maxAmountSpend'
import { useSwapCallback } from 'src/hooks/useSwapCallback'
import { computeTradePriceBreakdown, warningSeverity } from 'src/utils/prices'
import confirmPriceImpactWithoutFee from 'src/components/swap/confirmPriceImpactWithoutFee'
import { useIsSelectedAEBToken, useSelectedTokenList, useTokenList } from 'src/state/lists/hooks'
import { AVAX_BRIDGE_LIST, DEFI_TOKEN_LIST, STABLECOIN_TOKEN_LIST } from 'src/constants/lists'
import { TRUSTED_TOKEN_ADDRESSES } from 'src/constants'
import { isTokenOnList } from 'src/utils'
import TokenWarningModal from 'src/components/TokenWarningModal'
import { DeprecatedWarning } from 'src/components/Warning'
import SwapDetailInfo from '../../SwapDetailInfo'
import SwapRoute from '../../SwapRoute'
import {
  Root,
  SwapWrapper,
  CurrencyInputTextBox,
  ArrowWrapper,
  // AddARecipient
  PValue
} from './styled'
import { RowBetween } from 'src/components/Row'
import TradeOption from '../TradeOption'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'

interface Props {
  swapType: string
  setSwapType: (value: string) => void
}

const MarketOrder: React.FC<Props> = ({ swapType, setSwapType }) => {
  const [isRetryDrawerOpen, setIsRetryDrawerOpen] = useState(false)
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false)
  const [selectedPercentage, setSelectedPercentage] = useState(0)
  const [tokenDrawerType, setTokenDrawerType] = useState(Field.INPUT)

  const percentageValue = [25, 50, 75, 100]

  const loadedUrlParams = useDefaultsFromURLSearch()

  const { t } = useTranslation()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  // const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENS(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  // const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  // const betterTradeLinkVersion: Version | undefined = undefined
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers(chainId ? chainId : ChainId.AVALANCHE)
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const inputCurrency = currencies[Field.INPUT]
  const outputCurrency = currencies[Field.OUTPUT]

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const tradePrice = trade?.executionPrice
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(chainId || ChainId.AVALANCHE, trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(chainId ? chainId : ChainId.AVALANCHE, currencyBalances[Field.INPUT])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(chainId ? chainId : ChainId.AVALANCHE, trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [trade?.inputAmount?.currency?.symbol, trade?.outputAmount?.currency?.symbol, Version.v2].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  const handleSelectTokenDrawerClose = useCallback(() => {
    setIsTokenDrawerOpen(false)
  }, [setIsTokenDrawerOpen])

  // errors
  // const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  // const handleMaxInput = useCallback(() => {
  //   maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  // }, [maxAmountInput, onUserInput])

  const onCurrencySelect = useCallback(
    currency => {
      if (tokenDrawerType === Field.INPUT) {
        setApprovalSubmitted(false) // reset 2 step UI for approvals
      }
      onCurrencySelection(tokenDrawerType, currency)
    },
    [tokenDrawerType, onCurrencySelection]
  )

  const isAEBToken = useIsSelectedAEBToken()

  const selectedTokens = useSelectedTokenList()
  const whitelistedTokens = useTokenList([DEFI_TOKEN_LIST, AVAX_BRIDGE_LIST, STABLECOIN_TOKEN_LIST])

  const isTrustedToken = useCallback(
    (token: Token) => {
      if (!chainId || !selectedTokens) return true // Assume trusted at first to avoid flashing a warning
      return (
        TRUSTED_TOKEN_ADDRESSES[chainId].includes(token.address) || // trust token from manually whitelisted token
        isTokenOnList(selectedTokens, chainId || ChainId.AVALANCHE, token) || // trust all tokens from selected token list by user
        isTokenOnList(whitelistedTokens, chainId || ChainId.AVALANCHE, token) // trust all defi + AB tokens
      )
    },
    [chainId, selectedTokens, whitelistedTokens]
  )

  const showRoute = Boolean(trade && trade?.route?.path?.length > 2)

  const renderButton = () => {
    if (!account) {
      return (
        <Button variant="primary" onClick={toggleWalletModal}>
          {t('swapPage.connectWallet')}
        </Button>
      )
    }
    if (showWrap) {
      return (
        <Button variant="primary" isDisabled={Boolean(wrapInputError)} onClick={onWrap}>
          {wrapInputError ??
            (wrapType === WrapType.WRAP
              ? t('swapPage.wrap')
              : wrapType === WrapType.UNWRAP
              ? t('swapPage.unwrap')
              : null)}
        </Button>
      )
    }
    if (noRoute && userHasSpecifiedInputOutput) {
      return (
        <Button variant="primary" isDisabled>
          {t('swapPage.insufficientLiquidity')}
        </Button>
      )
    }

    if (showApproveFlow) {
      return (
        <RowBetween>
          <Box mr="10px" width="100%">
            <Button
              variant={approval === ApprovalState.APPROVED ? 'confirm' : 'primary'}
              onClick={approveCallback}
              isDisabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
              loading={approval === ApprovalState.PENDING}
              loadingText={t('swapPage.approving')}
            >
              {approvalSubmitted && approval === ApprovalState.APPROVED
                ? t('swapPage.approved')
                : t('swapPage.approve') + currencies[Field.INPUT]?.symbol}
            </Button>
          </Box>

          <Button
            variant="primary"
            onClick={() => {
              if (isExpertMode) {
                handleSwap()
              } else {
                setSwapState({
                  tradeToConfirm: trade,
                  attemptingTxn: false,
                  swapErrorMessage: undefined,
                  showConfirm: true,
                  txHash: undefined
                })
              }
            }}
            id="swap-button"
            isDisabled={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
            // error={isValid && priceImpactSeverity > 2}
          >
            {priceImpactSeverity > 3 && !isExpertMode
              ? t('swapPage.priceImpactHigh')
              : t('swapPage.swap') + `${priceImpactSeverity > 2 ? t('swapPage.anyway') : ''}`}
          </Button>
        </RowBetween>
      )
    }

    return (
      <Button
        variant="primary"
        onClick={() => {
          if (isExpertMode) {
            handleSwap()
          } else {
            setSwapState({
              tradeToConfirm: trade,
              attemptingTxn: false,
              swapErrorMessage: undefined,
              showConfirm: true,
              txHash: undefined
            })
          }
        }}
        id="swap-button"
        isDisabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || !!swapInputError}
        backgroundColor={isValid && priceImpactSeverity > 2 ? 'primary' : undefined}
        color={isValid && priceImpactSeverity <= 2 ? 'black' : undefined}
      >
        {swapInputError
          ? swapInputError
          : priceImpactSeverity > 3 && !isExpertMode
          ? t('swapPage.priceImpactHigh')
          : t('swapPage.swap') + `${priceImpactSeverity > 2 ? t('swapPage.anyway') : ''}`}
      </Button>
    )
  }

  const renderPercentage = () => {
    return (
      <Box display="flex" pb="5px">
        {percentageValue.map((value, index) => (
          <PValue
            key={index}
            isActive={selectedPercentage === value}
            onClick={() => {
              setSelectedPercentage(value)

              if (maxAmountInput) {
                const multipyAmount = JSBI.multiply(maxAmountInput?.raw, JSBI.BigInt(value))
                const divideAmount = JSBI.divide(multipyAmount, JSBI.BigInt(100))
                const token = wrappedCurrency(maxAmountInput?.currency ?? undefined, chainId) as Token
                const newFinalAmount = new TokenAmount(token, divideAmount)

                onUserInput(Field.INPUT, newFinalAmount.toExact())
              }
            }}
          >
            {value}%
          </PValue>
        ))}
      </Box>
    )
  }

  return (
    <Root>
      <TradeOption swapType={swapType} setSwapType={setSwapType} />
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning && !urlLoadedTokens.every(isTrustedToken)}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SwapWrapper>
        <Box p={10}>
          {isAEBToken && <DeprecatedWarning />}

          <CurrencyInputTextBox
            label={
              independentField === Field.OUTPUT && !showWrap && trade ? t('swapPage.fromEstimated') : t('swapPage.from')
            }
            value={formattedAmounts[Field.INPUT]}
            onChange={(value: any) => {
              setSelectedPercentage(0)
              handleTypeInput(value as any)
            }}
            onTokenClick={() => {
              setTokenDrawerType(Field.INPUT)
              setIsTokenDrawerOpen(true)
            }}
            currency={inputCurrency}
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            id="swap-currency-input"
            addonLabel={renderPercentage()}
          />

          <Box width="100%" textAlign="center" alignItems="center" display="flex" justifyContent={'center'} mt={10}>
            <ArrowWrapper
              onClick={() => {
                setApprovalSubmitted(false) // reset 2 step UI for approvals
                onSwitchTokens()
              }}
            >
              <RefreshCcw size="16" color={theme.text4} />
            </ArrowWrapper>
          </Box>

          <CurrencyInputTextBox
            label={
              independentField === Field.INPUT && !showWrap && trade ? t('swapPage.toEstimated') : t('swapPage.to')
            }
            value={formattedAmounts[Field.OUTPUT]}
            onChange={(value: any) => {
              setSelectedPercentage(0)
              handleTypeOutput(value as any)
            }}
            onTokenClick={() => {
              setTokenDrawerType(Field.OUTPUT)
              setIsTokenDrawerOpen(true)
            }}
            currency={outputCurrency}
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            id="swap-currency-output"
            addonLabel={
              tradePrice && (
                <Text color="text4" fontSize={16}>
                  {t('swapPage.price')}: {tradePrice?.toSignificant(6)} {tradePrice?.quoteCurrency?.symbol}
                </Text>
              )
            }
          />

          {trade && <SwapDetailInfo trade={trade} />}

          <Box width="100%" mt={10}>
            {renderButton()}
          </Box>
        </Box>
      </SwapWrapper>
      {trade && showRoute && <SwapRoute trade={trade} />}
      {/* Retries Drawer */}
      <RetryDrawer isOpen={isRetryDrawerOpen} onClose={() => setIsRetryDrawerOpen(false)} />
      {/* Token Drawer */}
      <SelectTokenDrawer
        isOpen={isTokenDrawerOpen}
        onClose={handleSelectTokenDrawerClose}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={tokenDrawerType === Field.INPUT ? inputCurrency : outputCurrency}
        otherSelectedCurrency={tokenDrawerType === Field.INPUT ? outputCurrency : inputCurrency}
      />
      {/* Confirm Swap Drawer */}
      {trade && (
        <ConfirmSwapDrawer
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onClose={handleConfirmDismiss}
        />
      )}
    </Root>
  )
}
export default MarketOrder

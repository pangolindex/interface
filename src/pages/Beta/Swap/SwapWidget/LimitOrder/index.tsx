import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react'
import { useGelatoLimitOrders } from '@gelatonetwork/limit-orders-react'
import ReactGA from 'react-ga'
import { RefreshCcw, ChevronDown, Divide, X } from 'react-feather'
import { Text, Box, Button, ToggleButtons } from '@pangolindex/components'
import { Token, Trade, JSBI, CurrencyAmount, TokenAmount, TradeType, Currency } from '@pangolindex/sdk'
import { ThemeContext } from 'styled-components'
import RetryDrawer from '../../RetryDrawer'
import SelectTokenDrawer from '../../SelectTokenDrawer'
import ConfirmSwapDrawer from '../../ConfirmSwapDrawer'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState, useDefaultsFromURLSearch } from 'src/state/swap/hooks'
import { LimitField, Field, LimitNewField } from 'src/state/swap/actions'
import { useCurrency } from 'src/hooks/Tokens'
import useWrapCallback, { WrapType } from 'src/hooks/useWrapCallback'
import useENS from 'src/hooks/useENS'
import useToggledVersion, { Version } from 'src/hooks/useToggledVersion'
import { useTranslation } from 'react-i18next'
import {
  ApprovalState,
  useApproveCallbackFromTrade,
  useApproveCallbackFromInputCurrencyAmount
} from 'src/hooks/useApproveCallback'
import { useActiveWeb3React } from 'src/hooks'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'src/state/user/hooks'
import { maxAmountSpend, galetoMaxAmountSpend } from 'src/utils/maxAmountSpend'
import { useSwapCallback } from 'src/hooks/useSwapCallback'
import { computeTradePriceBreakdown, warningSeverity } from 'src/utils/prices'
import confirmPriceImpactWithoutFee from 'src/components/swap/confirmPriceImpactWithoutFee'
import { useIsSelectedAEBToken, useSelectedTokenList, useTokenList } from 'src/state/lists/hooks'
import { AVAX_BRIDGE_LIST, DEFI_TOKEN_LIST } from 'src/constants/lists'
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
  ReTriesWrapper,
  InputText,
  GridContainer,
  ArrowWrapper,
  // AddARecipient
  PValue
} from './styled'
import { RowBetween } from 'src/components/Row'
import { NATIVE } from 'src/constants'

enum Rate {
  DIV = 'DIV',
  MUL = 'MUL'
}

const LimitOrder = () => {
  const [isRetryDrawerOpen, setIsRetryDrawerOpen] = useState(false)
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false)
  const [selectedPercentage, setSelectedPercentage] = useState(0)
  const [tokenDrawerType, setTokenDrawerType] = useState(Field.INPUT)
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell')
  const percentageValue = [25, 50, 75, 100]

  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  console.log('tokenDrawerType0', tokenDrawerType)
  const {
    handlers: {
      handleInput: onUserInput,
      handleRateType,
      handleCurrencySelection: onCurrencySelection,
      handleSwitchTokens: onSwitchTokens,
      handleLimitOrderSubmission
    },
    derivedOrderInfo: {
      parsedAmounts,
      currencies,
      currencyBalances,
      trade,
      formattedAmounts,
      inputError: swapInputError,
      rawAmounts,
      price
    },
    orderState: { independentField, rateType }
  } = useGelatoLimitOrders()

  console.log('trade', trade)

  const handleActiveTab = (tab: 'sell' | 'buy') => {
    if (activeTab === tab) return

    handleRateType(rateType, price)
    setActiveTab(tab)
  }

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
  const { typedValue, recipient } = useSwapState()
  // const {
  //   v1Trade,
  //   v2Trade
  //   //currencyBalances
  //   //parsedAmount,
  //   //currencies,
  //   //inputError: swapInputError
  // } = useDerivedSwapInfo()

  // const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
  //   currencies[LimitField.INPUT],
  //   currencies[LimitField.OUTPUT],
  //   typedValue
  // )
  // const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  // // const { address: recipientAddress } = useENS(recipient)
  // const toggledVersion = useToggledVersion()
  // const tradesByVersion = {
  //   [Version.v1]: v1Trade,
  //   [Version.v2]: v2Trade
  // }
  // const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  // const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  // const betterTradeLinkVersion: Version | undefined = undefined

  // const parsedAmounts = showWrap
  //   ? {
  //       [LimitNewField.INPUT]: parsedAmount,
  //       [LimitNewField.OUTPUT]: parsedAmount
  //     }
  //   : {
  //       [LimitNewField.INPUT]: independentField === LimitNewField.INPUT ? parsedAmount : trade?.inputAmount,
  //       [LimitNewField.OUTPUT]: independentField === LimitNewField.OUTPUT ? parsedAmount : trade?.outputAmount
  //     }

  ///const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const isValid = !swapInputError
  // const dependentField: LimitField = independentField === LimitField.INPUT ? LimitField.OUTPUT : LimitField.INPUT

  const inputCurrency = currencies[LimitField.INPUT]
  const outputCurrency = currencies[LimitField.OUTPUT]

  console.log('inputCurrency', inputCurrency)
  console.log('outputCurrency', outputCurrency)

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(LimitNewField.INPUT as any, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(LimitNewField.OUTPUT as any, value)
    },
    [onUserInput]
  )

  const handleTypeDesiredRate = useCallback(
    (value: string) => {
      onUserInput(LimitNewField.PRICE as any, value)
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

  // modal and loading
  // const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
  //   showConfirm: boolean
  //   tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
  //   attemptingTxn: boolean
  //   swapErrorMessage: string | undefined
  //   txHash: string | undefined
  // }>({
  //   showConfirm: false,
  //   tradeToConfirm: undefined,
  //   attemptingTxn: false,
  //   swapErrorMessage: undefined,
  //   txHash: undefined
  // })

  // const formattedAmounts = {
  //   [independentField]: typedValue,
  //   [dependentField]: showWrap
  //     ? parsedAmounts[independentField]?.toExact() ?? ''
  //     : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  // }

  // const route = trade?.route
  const tradePrice = trade?.executionPrice
  // const userHasSpecifiedInputOutput = Boolean(
  //   currencies[LimitField.INPUT] &&
  //     currencies[LimitField.OUTPUT] &&
  //     parsedAmounts[independentField.toLowerCase()]?.greaterThan(JSBI.BigInt(0))
  // )
  // const noRoute = !route

  // check whether the user has approved the router on the input token
  //const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const [approval, approveCallback] = useApproveCallbackFromInputCurrencyAmount(parsedAmounts.input)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = galetoMaxAmountSpend(currencyBalances[LimitField.INPUT])

  // the callback to execute the swap
  // const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade as any)

  // for
  const handleSwap = useCallback(() => {
    if (!handleLimitOrderSubmission) {
      return
    }

    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined
    })

    try {
      if (!currencies.input?.wrapped.address) {
        throw new Error('Invalid input currency')
      }

      if (!currencies.output?.wrapped.address) {
        throw new Error('Invalid output currency')
      }

      if (!rawAmounts.input) {
        throw new Error('Invalid input amount')
      }

      if (!rawAmounts.output) {
        throw new Error('Invalid output amount')
      }

      if (!account) {
        throw new Error('No account')
      }

      handleLimitOrderSubmission({
        inputToken: currencies.input?.isNative ? NATIVE : currencies.input?.wrapped.address,
        outputToken: currencies.output?.isNative ? NATIVE : currencies.output?.wrapped.address,
        inputAmount: rawAmounts.input,
        outputAmount: rawAmounts.output,
        owner: account
      })
        .then(({ hash }) => {
          setSwapState({
            attemptingTxn: false,
            tradeToConfirm,
            showConfirm,
            swapErrorMessage: undefined,
            txHash: hash
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
    } catch (error) {
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: (error as any).message,
        txHash: undefined
      })
    }
  }, [
    handleLimitOrderSubmission,
    tradeToConfirm,
    showConfirm,
    currencies.input?.wrapped.address,
    currencies.input?.isNative,
    currencies.output?.wrapped.address,
    currencies.output?.isNative,
    rawAmounts.input,
    rawAmounts.output,
    account
  ])

  const handleSelectTokenDrawerClose = useCallback(() => {
    setIsTokenDrawerOpen(false)
  }, [isTokenDrawerOpen])

  // const handleSwap = useCallback(() => {
  //   if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
  //     return
  //   }
  //   if (!swapCallback) {
  //     return
  //   }
  //   setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
  //   swapCallback()
  //     .then(hash => {
  //       setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

  //       ReactGA.event({
  //         category: 'Swap',
  //         action:
  //           recipient === null
  //             ? 'Swap w/o Send'
  //             : (recipientAddress ?? recipient) === account
  //             ? 'Swap w/o Send + recipient'
  //             : 'Swap w/ Send',
  //         label: [trade?.inputAmount?.currency?.symbol, trade?.outputAmount?.currency?.symbol, Version.v2].join('/')
  //       })
  //     })
  //     .catch(error => {
  //       setSwapState({
  //         attemptingTxn: false,
  //         tradeToConfirm,
  //         showConfirm,
  //         swapErrorMessage: error.message,
  //         txHash: undefined
  //       })
  //     })
  // }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

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
      onUserInput(LimitNewField.INPUT as any, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade as any, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  // const handleMaxInput = useCallback(() => {
  //   maxAmountInput && onUserInput(LimitNewField.INPUT, maxAmountInput.toExact())
  // }, [maxAmountInput, onUserInput])

  const onCurrencySelect = useCallback(
    currency => {
      console.log('123')
      if (tokenDrawerType === (LimitNewField.INPUT as any)) {
        setApprovalSubmitted(false) // reset 2 step UI for approvals
      }
      onCurrencySelection(tokenDrawerType as any, currency)
    },
    [tokenDrawerType, onCurrencySelection]
  )

  const isAEBToken = useIsSelectedAEBToken()

  const selectedTokens = useSelectedTokenList()
  const whitelistedTokens = useTokenList([DEFI_TOKEN_LIST, AVAX_BRIDGE_LIST])

  const isTrustedToken = useCallback(
    (token: Token) => {
      if (!chainId || !selectedTokens) return true // Assume trusted at first to avoid flashing a warning
      return (
        TRUSTED_TOKEN_ADDRESSES[chainId].includes(token.address) || // trust token from manually whitelisted token
        isTokenOnList(selectedTokens, token) || // trust all tokens from selected token list by user
        isTokenOnList(whitelistedTokens, token) // trust all defi + AB tokens
      )
    },
    [chainId, selectedTokens, whitelistedTokens]
  )

  // const showRoute = Boolean(trade && trade?.route?.path?.length > 2)

  const renderButton = () => {
    if (!account) {
      return (
        <Button variant="primary" onClick={toggleWalletModal}>
          {t('swapPage.connectWallet')}
        </Button>
      )
    }
    // if (showWrap) {
    //   return (
    //     <Button variant="primary" isDisabled={Boolean(wrapInputError)} onClick={onWrap}>
    //       {wrapInputError ??
    //         (wrapType === WrapType.WRAP
    //           ? t('swapPage.wrap')
    //           : wrapType === WrapType.UNWRAP
    //           ? t('swapPage.unwrap')
    //           : null)}
    //     </Button>
    //   )
    // }
    // if (noRoute && userHasSpecifiedInputOutput) {
    //   return (
    //     <Button variant="primary" isDisabled>
    //       {t('swapPage.insufficientLiquidity')}
    //     </Button>
    //   )
    // }

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
                : t('swapPage.approve') + currencies[LimitField.INPUT]?.symbol}
            </Button>
          </Box>

          <Button
            variant="primary"
            onClick={() => {
              if (isExpertMode) {
                handleSwap()
              } else {
                setSwapState({
                  tradeToConfirm: trade as any,
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
              tradeToConfirm: trade as any,
              attemptingTxn: false,
              swapErrorMessage: undefined,
              showConfirm: true,
              txHash: undefined
            })
          }
        }}
        id="swap-button"
        isDisabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapInputError}
        backgroundColor={isValid && priceImpactSeverity > 2 ? 'red1' : undefined}
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
              const newAmount = (maxAmountInput as TokenAmount)
                .multiply(JSBI.BigInt(value))
                .divide(JSBI.BigInt(100)) as TokenAmount

              onUserInput(LimitNewField.INPUT as any, newAmount.toExact())
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
      {/* <ConfirmSwapModal
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
        onDismiss={handleConfirmDismiss}
      /> */}
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning && !urlLoadedTokens.every(isTrustedToken)}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <Box textAlign="center" width="100%">
        <ToggleButtons
          options={['sell', 'buy']}
          value={activeTab}
          onChange={value => {
            handleActiveTab(value)
          }}
        />
      </Box>
      <SwapWrapper>
        <Box p={10}>
          {isAEBToken && <DeprecatedWarning />}

          <CurrencyInputTextBox
            label={
              independentField === (LimitNewField.OUTPUT as any) && trade
                ? t('swapPage.fromEstimated')
                : t('swapPage.from')
            }
            value={formattedAmounts[LimitField.INPUT]}
            onChange={(value: any) => {
              setSelectedPercentage(0)
              handleTypeInput(value as any)
            }}
            onTokenClick={() => {
              setTokenDrawerType(LimitNewField.INPUT as any)
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
            <ArrowWrapper>
              {rateType === Rate.MUL ? (
                <X size="16" color={currencies.input && currencies.output ? theme.text1 : theme.text3} />
              ) : (
                <Divide size="16" color={currencies.input && currencies.output ? theme.text1 : theme.text3} />
              )}
            </ArrowWrapper>
          </Box>

          <Box>
            <InputText
              value={formattedAmounts[LimitField.PRICE]}
              onChange={(value: any) => handleTypeDesiredRate(value as any)}
              fontSize={24}
              isNumeric={true}
              placeholder="0.00"
              label="Price"
            />
          </Box>
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
              independentField === (LimitNewField.INPUT as any) && trade ? t('swapPage.toEstimated') : t('swapPage.to')
            }
            value={formattedAmounts[LimitField.OUTPUT]}
            onChange={(value: any) => {
              setSelectedPercentage(0)
              handleTypeOutput(value as any)
            }}
            onTokenClick={() => {
              setTokenDrawerType(LimitNewField.OUTPUT as any)
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
                  Price: {tradePrice?.toSignificant(6)} {tradePrice?.quoteCurrency?.symbol}
                </Text>
              )
            }
          />

          {/* <GridContainer>
            <Box>
              <Text color="text4">Re-tries</Text>

              <ReTriesWrapper
                onClick={() => {
                  setIsRetryDrawerOpen(true)
                }}
              >
                1
                <Box ml={10}>
                  <ChevronDown size={14} color={theme.text4} />
                </Box>
              </ReTriesWrapper>
            </Box>
            <Box>
              <InputText
                value={''}
                onChange={(value: any) => {}}
                fontSize={24}
                isNumeric={true}
                placeholder="0.10%"
                label="Slippage"
              />
            </Box>
          </GridContainer> */}

          {/* {trade && <SwapDetailInfo trade={trade} />} */}

          <Box width="100%" mt={10}>
            {renderButton()}
          </Box>
        </Box>
      </SwapWrapper>
      {/* {trade && showRoute && <SwapRoute trade={trade} />} */}
      {/* Retries Drawer */}
      {/* <RetryDrawer isOpen={isRetryDrawerOpen} onClose={() => setIsRetryDrawerOpen(false)} /> */}
      {/* Token Drawer */}

      <SelectTokenDrawer
        isOpen={isTokenDrawerOpen}
        onClose={handleSelectTokenDrawerClose}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={tokenDrawerType === (LimitNewField.INPUT as any) ? inputCurrency : outputCurrency}
        otherSelectedCurrency={tokenDrawerType === (LimitNewField.INPUT as any) ? outputCurrency : inputCurrency}
      />

      {/* Confirm Swap Drawer */}
      {trade && (
        <ConfirmSwapDrawer
          isOpen={showConfirm}
          trade={trade as any}
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
export default LimitOrder

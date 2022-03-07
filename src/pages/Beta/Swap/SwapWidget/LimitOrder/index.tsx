import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useGelatoLimitOrders } from '@gelatonetwork/limit-orders-react'
import { RefreshCcw, Divide, X } from 'react-feather'
import { Text, Box, Button, ToggleButtons } from '@pangolindex/components'
import { Token, Trade, JSBI, TokenAmount, CAVAX, ChainId } from '@pangolindex/sdk'
import { CurrencyAmount, Currency as UniCurrency } from '@uniswap/sdk-core'
import { ThemeContext } from 'styled-components'
import SelectTokenDrawer from '../../SelectTokenDrawer'
import ConfirmLimitOrderDrawer from '../../ConfirmLimitOrderDrawer'
import { LimitField, LimitNewField } from 'src/state/swap/actions'
import { useTranslation } from 'react-i18next'
import { ApprovalState, useApproveCallbackFromInputCurrencyAmount } from 'src/hooks/useApproveCallback'
import { useActiveWeb3React } from 'src/hooks'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { galetoMaxAmountSpend } from 'src/utils/maxAmountSpend'
import { useIsSelectedAEBToken } from 'src/state/lists/hooks'
import { useUserSlippageTolerance } from 'src/state/user/hooks'
import { DeprecatedWarning } from 'src/components/Warning'
import { Root, SwapWrapper, CurrencyInputTextBox, InputText, ArrowWrapper, PValue } from './styled'
import { RowBetween } from 'src/components/Row'
import { NATIVE } from 'src/constants'
import LimitOrderDetailInfo from '../../LimitOrderDetailInfo'
import TradeOption from '../TradeOption'
import { wrappedGelatoCurrency } from 'src/utils/wrappedCurrency'
import { useSwapActionHandlers } from 'src/state/swap/hooks'
import { useQueryClient } from 'react-query'

enum Rate {
  DIV = 'DIV',
  MUL = 'MUL'
}

interface Props {
  swapType: string
  setSwapType: (value: string) => void
}

const LimitOrder: React.FC<Props> = ({ swapType, setSwapType }) => {
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false)
  const [selectedPercentage, setSelectedPercentage] = useState(0)
  const [tokenDrawerType, setTokenDrawerType] = useState(LimitNewField.INPUT)
  const [activeTab, setActiveTab] = useState<'SELL' | 'BUY'>('SELL')
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  const percentageValue = [25, 50, 75, 100]

  const { t } = useTranslation()

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

  const { onCurrencySelection: onSwapCurrencySelection } = useSwapActionHandlers(chainId ? chainId : ChainId.AVALANCHE)

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const recipient = account ?? null
  const isValid = !swapInputError

  const gelatoInputCurrency = currencies[LimitField.INPUT] as any
  const gelatoOutputCurrency = currencies[LimitField.OUTPUT] as any

  const inputTokenInfo = gelatoInputCurrency?.tokenInfo
  const outputTokenInfo = gelatoOutputCurrency?.tokenInfo

  const inputCurrency =
    chainId && gelatoInputCurrency && gelatoInputCurrency?.symbol === CAVAX[chainId].symbol
      ? CAVAX[chainId]
      : chainId && inputTokenInfo && inputTokenInfo.symbol === CAVAX[chainId].symbol
      ? CAVAX[chainId]
      : inputTokenInfo
      ? new Token(
          inputTokenInfo?.chainId,
          inputTokenInfo?.address,
          inputTokenInfo?.decimals,
          inputTokenInfo?.symbol,
          inputTokenInfo?.name
        )
      : gelatoInputCurrency && gelatoInputCurrency.isToken
      ? new Token(
          gelatoInputCurrency?.chainId,
          gelatoInputCurrency?.address,
          gelatoInputCurrency?.decimals,
          gelatoInputCurrency?.symbol,
          gelatoInputCurrency?.name
        )
      : undefined

  const outputCurrency =
    chainId && gelatoOutputCurrency && gelatoOutputCurrency?.symbol === CAVAX[chainId].symbol
      ? CAVAX[chainId]
      : chainId && outputTokenInfo && outputTokenInfo?.symbol === CAVAX[chainId].symbol
      ? CAVAX[chainId]
      : outputTokenInfo
      ? new Token(
          outputTokenInfo?.chainId,
          outputTokenInfo?.address,
          outputTokenInfo?.decimals,
          outputTokenInfo?.symbol,
          outputTokenInfo?.name
        )
      : gelatoOutputCurrency && gelatoOutputCurrency.isToken
      ? new Token(
          gelatoOutputCurrency?.chainId,
          gelatoOutputCurrency?.address,
          gelatoOutputCurrency?.decimals,
          gelatoOutputCurrency?.symbol,
          gelatoOutputCurrency?.name
        )
      : undefined

  const handleActiveTab = (tab: 'SELL' | 'BUY') => {
    if (activeTab === tab) return

    handleRateType(rateType, price)
    setActiveTab(tab)
  }

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

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

  // price
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

  // const route = trade?.route
  const tradePrice = trade?.executionPrice

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromInputCurrencyAmount(
    chainId ? chainId : ChainId.AVALANCHE,
    parsedAmounts.input
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<UniCurrency> | undefined = galetoMaxAmountSpend(
    chainId ? chainId : ChainId.AVALANCHE,
    currencyBalances[LimitField.INPUT]
  )

  const queryClient = useQueryClient()

  // for limit swap
  const handleSwap = useCallback(() => {
    // refetch balances in my portfolio widget
    queryClient.refetchQueries(['getWalletChainTokens', 'getChainBalance'])
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
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } catch (error) {
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: (error as any).message,
        txHash: undefined
      })
      // we only care if the error is something _other_ than the user rejected the tx
      if ((error as any)?.code !== 4001) {
        console.error(error)
      }
    }
  }, [
    handleLimitOrderSubmission,
    tradeToConfirm,
    showConfirm,
    currencies.input,
    currencies.output,
    rawAmounts.input,
    rawAmounts.output,
    account,
    queryClient
  ])

  const handleSelectTokenDrawerClose = useCallback(() => {
    setIsTokenDrawerOpen(false)
  }, [setIsTokenDrawerOpen])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode

  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

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

  const onCurrencySelect = useCallback(
    currency => {
      if (tokenDrawerType === (LimitNewField.INPUT as any)) {
        setApprovalSubmitted(false) // reset 2 step UI for approvals
      }

      // here need to add isToken because in Galato hook require this variable to select currency
      const newCurrency = { ...currency }
      if (chainId && currency?.symbol === CAVAX[chainId].symbol) {
        newCurrency.isNative = true
      } else {
        newCurrency.isToken = true
      }

      onCurrencySelection(tokenDrawerType as any, newCurrency)
      // this is to update tokens on chart on token selection
      onSwapCurrencySelection(tokenDrawerType as any, currency)
    },
    [chainId, tokenDrawerType, onCurrencySelection, onSwapCurrencySelection]
  )

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  const isAEBToken = useIsSelectedAEBToken()

  const renderButton = () => {
    if (!account) {
      return (
        <Button variant="primary" onClick={toggleWalletModal}>
          {t('swapPage.connectWallet')}
        </Button>
      )
    }

    if (showApproveFlow) {
      return (
        <RowBetween>
          <Box mr="10px" width="100%">
            <Button
              variant={approval === ApprovalState.APPROVED ? 'confirm' : 'primary'}
              onClick={handleApprove}
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
              setSwapState({
                tradeToConfirm: trade as any,
                attemptingTxn: false,
                swapErrorMessage: undefined,
                showConfirm: true,
                txHash: undefined
              })
            }}
            id="swap-button"
            isDisabled={!isValid || approval !== ApprovalState.APPROVED}
            //error={isValid}
          >
            {t('swapPage.placeOrder')}
          </Button>
        </RowBetween>
      )
    }

    return (
      <Button
        variant="primary"
        onClick={() => {
          setSwapState({
            tradeToConfirm: trade as any,
            attemptingTxn: false,
            swapErrorMessage: undefined,
            showConfirm: true,
            txHash: undefined
          })
        }}
        id="swap-button"
        isDisabled={!isValid || !!swapInputError}
        backgroundColor={isValid ? 'primary' : undefined}
      >
        {swapInputError ? swapInputError : t('swapPage.placeOrder')}
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
                const multipyAmount = JSBI.multiply(maxAmountInput?.numerator, JSBI.BigInt(value)) //Currency from uniswap sdk-core not contain raw function
                const divideAmount = JSBI.divide(multipyAmount, JSBI.BigInt(100))
                const token = wrappedGelatoCurrency(maxAmountInput?.currency ?? undefined, chainId) as Token
                const newFinalAmount = new TokenAmount(token, divideAmount)

                onUserInput(LimitNewField.INPUT as any, newFinalAmount.toExact())
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

      <SwapWrapper>
        <Box textAlign="center" width="100%">
          <ToggleButtons
            options={[t('swapPage.sell'), t('swapPage.buy')]}
            value={activeTab}
            onChange={value => {
              handleActiveTab(value)
            }}
          />
        </Box>

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
                  {t('swapPage.price')}: {tradePrice?.toSignificant(6)} {tradePrice?.quoteCurrency?.symbol}
                </Text>
              )
            }
          />

          {trade && <LimitOrderDetailInfo trade={trade} />}

          <Box width="100%" mt={10}>
            {renderButton()}
          </Box>
        </Box>
      </SwapWrapper>

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
        <ConfirmLimitOrderDrawer
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

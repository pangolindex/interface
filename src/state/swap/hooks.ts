import { Version } from '../../hooks/useToggledVersion'
import { parseUnits } from '@ethersproject/units'
import {
  Currency,
  CurrencyAmount,
  CAVAX,
  JSBI,
  Token,
  TokenAmount,
  Trade,
  FACTORY_ADDRESS,
  ChainId,
  Price
} from '@pangolindex/sdk'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { SwapState } from './reducer'
import useToggledVersion from '../../hooks/useToggledVersion'
import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import { ROUTER_ADDRESS, SWAP_DEFAULT_CURRENCY } from '../../constants'
import { useTranslation } from 'react-i18next'
import { NATIVE } from 'src/constants'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { Order, useGelatoLimitOrdersLib, useGelatoLimitOrdersHistory } from '@gelatonetwork/limit-orders-react'

export interface LimitOrderInfo extends Order {
  pending?: boolean
}

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>(state => state.swap)
}

export function useSwapActionHandlers(
  chainId: ChainId
): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId:
            currency instanceof Token ? currency.address : chainId && currency === CAVAX[chainId] ? 'AVAX' : ''
        })
      )
    },
    [chainId, dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(chainId: ChainId, value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed), chainId ? chainId : ChainId.AVALANCHE)
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  FACTORY_ADDRESS[ChainId.AVALANCHE], // v2 factory
  ROUTER_ADDRESS[ChainId.AVALANCHE] // v2 router 02
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some(token => token.address === checksummedAddress) ||
    trade.route.pairs.some(pair => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined
  inputError?: string
  v1Trade: Trade | undefined
} {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const toggledVersion = useToggledVersion()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientAddress = isAddress(recipient)
  const to: string | null = (recipientAddress ? recipientAddress : account) ?? null

  const relevantTokenBalances = useCurrencyBalances(chainId || ChainId.AVALANCHE, account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(
    chainId ? chainId : ChainId.AVALANCHE,
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  )

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1]
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined
  }

  // get link to trade on v1, if a better rate exists
  const v1Trade = undefined

  let inputError: string | undefined
  if (!account) {
    inputError = t('swapHooks.connectWallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('swapHooks.enterAmount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('swapHooks.selectToken')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('swapHooks.enterRecipient')
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? t('swapHooks.invalidRecipient')
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage, chainId ? chainId : ChainId.AVALANCHE)

  const slippageAdjustedAmountsV1 =
    v1Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v1Trade, allowedSlippage, chainId ? chainId : ChainId.AVALANCHE)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    toggledVersion === Version.v1
      ? slippageAdjustedAmountsV1
        ? slippageAdjustedAmountsV1[Field.INPUT]
        : null
      : slippageAdjustedAmounts
      ? slippageAdjustedAmounts[Field.INPUT]
      : null
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('swapHooks.insufficient') + amountIn.currency.symbol + t('swapHooks.balance')
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
    v1Trade
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'AVAX') return 'AVAX'
    if (valid === false) return 'AVAX'
  }
  return 'AVAX' ?? ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId || SWAP_DEFAULT_CURRENCY[chainId]?.inputCurrency,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId || SWAP_DEFAULT_CURRENCY[chainId]?.outputCurrnecy,
        recipient: parsed.recipient
      })
    )

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}

export function useGelatoLimitOrderDetail(order: Order) {
  const { chainId } = useActiveWeb3React()
  const gelatoLibrary = useGelatoLimitOrdersLib()

  const inputCurrency = order.inputToken === NATIVE && chainId ? 'AVAX' : order.inputToken
  const outputCurrency = order.outputToken === NATIVE && chainId ? 'AVAX' : order.outputToken

  const currency0 = useCurrency(inputCurrency)
  const currency1 = useCurrency(outputCurrency)

  const inputToken = currency0 ? wrappedCurrency(currency0, chainId) : undefined
  const outputToken = currency1 ? wrappedCurrency(currency1, chainId) : undefined

  const inputAmount = useMemo(
    () => (inputToken && order.inputAmount ? new TokenAmount(inputToken, order.inputAmount) : undefined),
    [inputToken, order.inputAmount]
  )

  const rawMinReturn = useMemo(
    () =>
      order.adjustedMinReturn
        ? order.adjustedMinReturn
        : gelatoLibrary && chainId && order.minReturn
        ? gelatoLibrary.getAdjustedMinReturn(order.minReturn)
        : undefined,
    [chainId, gelatoLibrary, order.adjustedMinReturn, order.minReturn]
  )

  const outputAmount = useMemo(
    () => (outputToken && rawMinReturn ? new TokenAmount(outputToken, rawMinReturn) : undefined),
    [outputToken, rawMinReturn]
  )

  const executionPrice = useMemo(
    () =>
      outputAmount && outputAmount.greaterThan('0') && inputAmount && currency0 && currency1
        ? new Price(currency0, currency1, inputAmount?.raw, outputAmount?.raw)
        : undefined,
    [currency0, currency1, inputAmount, outputAmount]
  )

  return useMemo(
    () => ({
      currency0,
      currency1,
      inputAmount,
      outputAmount,
      executionPrice
    }),
    [currency0, currency1, inputAmount, outputAmount, executionPrice]
  )
}

export function useGelatoLimitOrderList() {
  const { open, executed, cancelled } = useGelatoLimitOrdersHistory()

  const openPending = useMemo(
    () =>
      (open.pending || []).map(item => {
        const container = { ...item } as any
        container['pending'] = true
        return container
      }),
    [open.pending]
  )

  const cancelledPending = useMemo(
    () =>
      (cancelled.pending || []).map(item => {
        const container = { ...item } as any
        container['pending'] = true
        return container
      }),
    [cancelled.pending]
  )

  const allOrders = useMemo(
    () => [...cancelledPending, ...openPending, ...open.confirmed, ...cancelled.confirmed, ...executed],
    [openPending, cancelledPending, open.confirmed, cancelled.confirmed, executed]
  )

  const allOpenOrders = useMemo(() => [...cancelledPending, ...openPending, ...open.confirmed], [
    openPending,
    cancelledPending,
    open.confirmed
  ])

  const allCancelledOrders = useMemo(() => cancelled.confirmed, [cancelled.confirmed])

  return useMemo(
    () => ({
      allOrders,
      allOpenOrders,
      allCancelledOrders,
      executed
    }),
    [allOrders, allOpenOrders, allCancelledOrders, executed]
  )
}

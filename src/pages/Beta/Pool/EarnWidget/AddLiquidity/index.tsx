import React, { useContext, useCallback, useState } from 'react'
import { Currency, CAVAX, TokenAmount } from '@pangolindex/sdk'
import { PageWrapper, InputText, StyledBalanceMax, ArrowWrapper, LightCard } from './styleds'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from '@pangolindex/components'
import { Plus } from 'react-feather'
import { RowBetween } from 'src/components/Row'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { ThemeContext } from 'styled-components'
import { Field } from 'src/state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'src/state/mint/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from 'src/state/user/hooks'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { maxAmountSpend } from 'src/utils/maxAmountSpend'
import { ApprovalState, useApproveCallback } from 'src/hooks/useApproveCallback'
import { ROUTER_ADDRESS } from 'src/constants'
import { ChainId } from '@pangolindex/sdk'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'src/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import ReactGA from 'react-ga'
import { AutoColumn } from 'src/components/Column'
import PoolPriceBar from './PoolPriceBar'
import { PairState } from 'src/data/Reserves'
import ConfirmPoolDrawer from './ConfirmPoolDrawer'
import { useCurrencyBalance } from 'src/state/wallet/hooks'

interface AddLiquidityProps {
  currencyA: Currency
  currencyB: Currency
  onComplete?: () => void
}

const AddLiquidity = ({ currencyA, currencyB, onComplete }: AddLiquidityProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    // pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.AVALANCHE]
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.AVALANCHE]
  )

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === CAVAX || currencyB === CAVAX) {
      const tokenBIsETH = currencyB === CAVAX
      estimate = router.estimateGas.addLiquidityAVAX
      method = router.addLiquidityAVAX
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const handleTypeInput = useCallback(
    (value: string) => {
      onFieldAInput(value)
    },
    [onFieldAInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onFieldBInput(value)
    },
    [onFieldBInput]
  )

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const selectedCurrencyBalanceA = useCurrencyBalance(account ?? undefined, currencyA ?? undefined)
  const selectedCurrencyBalanceB = useCurrencyBalance(account ?? undefined, currencyB ?? undefined)

  const renderButton = () => {
    if (!account) {
      return (
        <Button variant="primary" onClick={toggleWalletModal}>
          {t('swapPage.connectWallet')}
        </Button>
      )
    } else {
      return (
        <AutoColumn gap={'md'}>
          {(approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING) &&
            isValid && (
              <RowBetween>
                {approvalA !== ApprovalState.APPROVED && (
                  <Button
                    variant="primary"
                    onClick={approveACallback}
                    isDisabled={approvalA === ApprovalState.PENDING}
                    width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                    loading={approvalA === ApprovalState.PENDING}
                    loadingText={`${t('swapPage.approving')} ${currencies[Field.CURRENCY_A]?.symbol}`}
                  >
                    {t('addLiquidity.approve') + currencies[Field.CURRENCY_A]?.symbol}
                  </Button>
                )}
                {approvalB !== ApprovalState.APPROVED && (
                  <Button
                    variant="primary"
                    onClick={approveBCallback}
                    isDisabled={approvalB === ApprovalState.PENDING}
                    width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                    loading={approvalB === ApprovalState.PENDING}
                    loadingText={`${t('swapPage.approving')} ${currencies[Field.CURRENCY_B]?.symbol}`}
                  >
                    {t('addLiquidity.approve') + currencies[Field.CURRENCY_B]?.symbol}
                  </Button>
                )}
              </RowBetween>
            )}
          <Button
            variant="primary"
            onClick={() => {
              expertMode ? onAdd() : setShowConfirm(true)
            }}
            isDisabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
            //error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
          >
            {error ?? t('addLiquidity.supply')}
          </Button>
        </AutoColumn>
      )
    }
  }

  return (
    <PageWrapper>
      <InputText
        value={formattedAmounts[Field.CURRENCY_A]}
        addonAfter={
          !atMaxAmounts[Field.CURRENCY_A] ? (
            <Box display={'flex'} alignItems={'center'} height={'100%'} justifyContent={'center'}>
              <StyledBalanceMax onClick={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')}>
                {t('currencyInputPanel.max')}
              </StyledBalanceMax>
            </Box>
          ) : (
            ''
          )
        }
        onChange={(value: any) => {
          handleTypeInput(value as any)
        }}
        label={`${currencyA?.symbol} Input`}
        fontSize={24}
        isNumeric={true}
        placeholder="0.00"
        addonLabel={
          account && (
            <Text color="text2" fontWeight={500} fontSize={14}>
              {!!currencyA && selectedCurrencyBalanceA
                ? t('currencyInputPanel.balance') + selectedCurrencyBalanceA?.toSignificant(6)
                : ' -'}
            </Text>
          )
        }
      />

      <Box width="100%" textAlign="center" alignItems="center" display="flex" justifyContent={'center'} mt={10}>
        <ArrowWrapper>
          <Plus size="16" color={theme.text1} />
        </ArrowWrapper>
      </Box>

      <InputText
        value={formattedAmounts[Field.CURRENCY_B]}
        addonAfter={
          !atMaxAmounts[Field.CURRENCY_B] ? (
            <Box display={'flex'} alignItems={'center'} height={'100%'} justifyContent={'center'}>
              <StyledBalanceMax onClick={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}>
                {t('currencyInputPanel.max')}
              </StyledBalanceMax>
            </Box>
          ) : (
            ''
          )
        }
        onChange={(value: any) => {
          handleTypeOutput(value as any)
        }}
        label={`${currencyB?.symbol} Input`}
        fontSize={24}
        isNumeric={true}
        placeholder="0.00"
        addonLabel={
          account && (
            <Text color="text2" fontWeight={500} fontSize={14}>
              {!!currencyB && selectedCurrencyBalanceB
                ? t('currencyInputPanel.balance') + selectedCurrencyBalanceB?.toSignificant(6)
                : ' -'}
            </Text>
          )
        }
      />

      {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
        <LightCard padding="0px">
          {/* <Text fontWeight={500} fontSize={14} color="text1">
            {noLiquidity ? t('addLiquidity.initialPrices') : t('addLiquidity.prices')} {t('addLiquidity.poolShare')}
          </Text> */}

          <PoolPriceBar
            currencies={currencies}
            poolTokenPercentage={poolTokenPercentage}
            noLiquidity={noLiquidity}
            price={price}
            parsedAmounts={parsedAmounts}
          />
        </LightCard>
      )}

      <Box width="100%" mt={10}>
        {renderButton()}
      </Box>

      {/* Confirm Swap Drawer */}
      {showConfirm && (
        <ConfirmPoolDrawer
          isOpen={showConfirm}
          allowedSlippage={allowedSlippage}
          poolErrorMessage={error}
          price={price}
          currencies={currencies}
          parsedAmounts={parsedAmounts}
          noLiquidity={noLiquidity}
          liquidityMinted={liquidityMinted}
          onAdd={onAdd}
          poolTokenPercentage={poolTokenPercentage}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          onClose={handleDismissConfirmation}
          onComplete={onComplete}
        />
      )}

      {/* {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <LightCard>
          <Text fontSize={12} color="text1" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            {t('positionCard.byAddingLiquidityInfo')}
          </Text>
        </LightCard>
      ) : null} */}
    </PageWrapper>
  )
}
export default AddLiquidity

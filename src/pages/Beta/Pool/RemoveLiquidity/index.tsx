import React, { useState, useCallback, useMemo, useEffect } from 'react'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { RemoveWrapper, InputText, ContentBox } from './styleds'
import { Box, Text, Button, NumberOptions } from '@pangolindex/components'
import ReactGA from 'react-ga'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import { Currency, Percent, CAVAX } from '@pangolindex/sdk'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useTranslation } from 'react-i18next'
import { RowBetween } from 'src/components/Row'
import { ROUTER_ADDRESS } from 'src/constants'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from 'src/state/burn/hooks'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { useUserSlippageTolerance } from 'src/state/user/hooks'
import { Field } from 'src/state/burn/actions'
import { BigNumber, Contract } from 'ethers'
import { usePairContract } from 'src/hooks/useContract'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'src/utils'
import Stat from 'src/components/Stat'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'

interface RemoveLiquidityProps {
  currencyA: Currency
  currencyB: Currency
}

const RemoveLiquidity = ({ currencyA, currencyB }: RemoveLiquidityProps) => {
  const { account, library } = useActiveWeb3React()
  const chainId = useChainId()

  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
    currencyA,
    currencyB,
    chainId
  ])

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error, userLiquidity } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // state for pending and submitted txn views
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
  }

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    chainId,
    parsedAmounts[Field.LIQUIDITY],
    ROUTER_ADDRESS[chainId]
  )

  const { t } = useTranslation()
  const [percetage, setPercetage] = useState(100)

  useEffect(() => {
    _onUserInput(Field.LIQUIDITY_PERCENT, `100`)
  }, [_onUserInput])

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline || !chainId || !account)
      throw new Error(t('earn.missingDependencies'))
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pangolin Liquidity',
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[chainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(err => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const onChangePercentage = (value: number) => {
    _onUserInput(Field.LIQUIDITY_PERCENT, `${value}`)
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (_typedValue: string) => {
      setSignatureData(null)
      _onUserInput(Field.LIQUIDITY, _typedValue)
    },
    [_onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error(t('error.missingDependencies'))
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error(t('error.missingCurrencyAmounts'))
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }

    if (!currencyA || !currencyB) throw new Error(t('error.missingTokens'))
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error(t('error.missingLiquidityAmount'))

    const currencyBIsAVAX = currencyB === CAVAX[chainId]
    const oneCurrencyIsAVAX = currencyA === CAVAX[chainId] || currencyBIsAVAX

    if (!tokenA || !tokenB) throw new Error(t('error.couldNotWrap'))

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityAVAX
      if (oneCurrencyIsAVAX) {
        methodNames = ['removeLiquidityAVAX', 'removeLiquidityAVAXSupportingFeeOnTransferTokens']
        args = [
          currencyBIsAVAX ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsAVAX ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsAVAX ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString()
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString()
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityAVAXWithPermit
      if (oneCurrencyIsAVAX) {
        methodNames = ['removeLiquidityAVAXWithPermit', 'removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsAVAX ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsAVAX ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsAVAX ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
      // removeLiquidityAVAXWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
    } else {
      throw new Error(t('error.attemptingToConfirmApproval'))
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(err => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttempting(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary:
              t('removeLiquidity.remove') +
              ' ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencyA?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencyB?.symbol
          })

          setHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/')
          })
        })
        .catch((err: any) => {
          setAttempting(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (err?.code !== 4001) {
            console.error(err)
          }
        })
    }
  }

  return (
    <RemoveWrapper>
      {!attempting && !hash && (
        <>
          <Box flex={1}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <InputText
                  value={parsedAmounts[Field.LIQUIDITY]?.toExact() || ''}
                  addonAfter={
                    <Box display="flex" alignItems="center">
                      <Text color="text4" fontSize={24}>
                        PGL
                      </Text>
                    </Box>
                  }
                  onChange={(value: any) => {
                    onUserInput(value)
                  }}
                  fontSize={24}
                  isNumeric={true}
                  placeholder="0.00"
                  addonLabel={
                    account && (
                      <Text color="text2" fontWeight={500} fontSize={14}>
                        {!!userLiquidity ? t('currencyInputPanel.balance') + userLiquidity?.toSignificant(6) : ' -'}
                      </Text>
                    )
                  }
                />

                <Box ml="5px" mt="25px">
                  <NumberOptions
                    onChange={value => {
                      setPercetage(value)
                      onChangePercentage(value)
                    }}
                    currentValue={percetage}
                    variant="box"
                    isPercentage={true}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <ContentBox>
                <Stat
                  title={tokenA?.symbol}
                  stat={`${formattedAmounts[Field.CURRENCY_A] || '-'}`}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={16}
                  titleColor="text4"
                  statAlign="center"
                />

                <Stat
                  title={tokenB?.symbol}
                  stat={`${formattedAmounts[Field.CURRENCY_B] || '-'}`}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={16}
                  titleColor="text4"
                  statAlign="center"
                />
              </ContentBox>
            </Box>
          </Box>
          <Box mt={10}>
            {!account ? (
              <Button
                variant="primary"
                onClick={() => {
                  toggleWalletModal()
                }}
                height="46px"
              >
                {t('earn.deposit')}
              </Button>
            ) : (
              <RowBetween>
                <Box mr="5px" width="100%">
                  <Button
                    variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
                    onClick={onAttemptToApprove}
                    isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                    loading={attempting && !hash}
                    loadingText={t('removeLiquidity.approving')}
                    height="46px"
                  >
                    {approval === ApprovalState.PENDING
                      ? t('removeLiquidity.approving')
                      : approval === ApprovalState.APPROVED || signatureData !== null
                      ? t('removeLiquidity.approved')
                      : t('removeLiquidity.approve')}
                  </Button>
                </Box>

                <Box width="100%">
                  <Button
                    variant="primary"
                    isDisabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                    onClick={() => {
                      onRemove()
                    }}
                    loading={attempting && !hash}
                    loadingText={t('migratePage.loading')}
                    height="46px"
                  >
                    {error || t('removeLiquidity.remove')}
                  </Button>
                </Box>
              </RowBetween>
            )}
          </Box>
        </>
      )}

      {attempting && !hash && <Loader size={100} label={`Removing Liquidity...`} />}
      {attempting && hash && <TransactionCompleted submitText={`Removed Liquidity`} />}
    </RemoveWrapper>
  )
}
export default RemoveLiquidity

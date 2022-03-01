import React, { useState, useCallback, useMemo, useEffect } from 'react'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { PageWrapper, InputText, ContentBox, DataBox } from './styleds'
import { Box, Text, Button, Steps, Step } from '@pangolindex/components'
import ReactGA from 'react-ga'
import { useActiveWeb3React } from 'src/hooks'
import { Currency, ChainId, Percent, CAVAX } from '@pangolindex/sdk'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useTranslation } from 'react-i18next'
import ConfirmRemoveDrawer from './ConfirmRemoveDrawer'
import { RowBetween } from 'src/components/Row'
import { ROUTER_ADDRESS } from 'src/constants'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useBurnActionHandlers } from 'src/state/burn/hooks'
import { useDerivedBurnInfo, useBurnState } from 'src/state/burn/hooks'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { useUserSlippageTolerance } from 'src/state/user/hooks'
import { Field } from 'src/state/burn/actions'
import { BigNumber, Contract } from 'ethers'
import { usePairContract } from 'src/hooks/useContract'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'src/utils'

interface RemoveLiquidityProps {
  currencyA: Currency
  currencyB: Currency
  onClose: () => void
}

const RemoveLiquidity = ({ currencyA, currencyB, onClose }: RemoveLiquidityProps) => {
  const { account, chainId, library } = useActiveWeb3React()

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

  // sub modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
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
    chainId ? chainId : ChainId.AVALANCHE,
    parsedAmounts[Field.LIQUIDITY],
    chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.AVALANCHE]
  )

  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(4)

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
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const onChangeDot = (value: number) => {
    setStepIndex(value)
    _onUserInput(Field.LIQUIDITY_PERCENT, `${value * 25}`)
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (typedValue: string) => {
      setSignatureData(null)
      _onUserInput(Field.LIQUIDITY, typedValue)
    },
    [_onUserInput]
  )

  const renderPoolDataRow = (label?: string, value?: string) => {
    return (
      <DataBox key={label}>
        <Text color="text4" fontSize={16}>
          {label}
        </Text>

        <Text color="text4" fontSize={16}>
          {value}
        </Text>
      </DataBox>
    )
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (hash) {
      _onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setHash('')
    setAttempting(false)
  }, [_onUserInput, hash])

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      // TODO: Translate using i18n
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }

    // TODO: Translate using i18n
    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsAVAX = currencyB === CAVAX[chainId || ChainId.AVALANCHE]
    const oneCurrencyIsAVAX = currencyA === CAVAX[chainId || ChainId.AVALANCHE] || currencyBIsAVAX

    // TODO: Translate using i18n
    if (!tokenA || !tokenB) throw new Error('could not wrap')

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
      // TODO: Translate using i18n
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
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
          // TODO: Translate using i18n
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
        .catch((error: any) => {
          setAttempting(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    }
  }

  return (
    <PageWrapper>
      <Box mt={10}>
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
            onUserInput(value as any)
          }}
          fontSize={24}
          isNumeric={true}
          placeholder="0.00"
          addonLabel={
            account && (
              <Text color="text2" fontWeight={500} fontSize={14}>
                {!!userLiquidity ? t('earn.availableToDeposit') + userLiquidity?.toSignificant(6) : ' -'}
              </Text>
            )
          }
        />
      </Box>

      <Box>
        <Steps
          onChange={value => {
            onChangeDot && onChangeDot(value)
          }}
          current={stepIndex}
          progressDot={true}
        >
          <Step />
          <Step />
          <Step />
          <Step />
          <Step />
        </Steps>
      </Box>

      <Box>
        <ContentBox>
          {renderPoolDataRow(tokenA?.symbol, formattedAmounts[Field.CURRENCY_A] || '-')}
          {renderPoolDataRow(tokenB?.symbol, formattedAmounts[Field.CURRENCY_B] || '-')}
        </ContentBox>
      </Box>
      <Box mt={10}>
        {!account ? (
          <Button
            variant="primary"
            onClick={() => {
              toggleWalletModal()
            }}
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
                  setShowConfirm(true)
                  // onRemove()
                }}
                loading={attempting && !hash}
                loadingText={t('migratePage.loading')}
              >
                {error || t('removeLiquidity.remove')}
              </Button>
            </Box>
          </RowBetween>
        )}
      </Box>

      {showConfirm && (
        <ConfirmRemoveDrawer
          isOpen={showConfirm}
          parsedAmounts={parsedAmounts}
          attemptingTxn={attempting}
          txHash={hash}
          onClose={handleDismissConfirmation}
          allowedSlippage={allowedSlippage}
          pair={pair}
          currencyA={currencyA}
          currencyB={currencyB}
          onConfirm={onRemove}
          onComplete={onClose}
        />
      )}
    </PageWrapper>
  )
}
export default RemoveLiquidity

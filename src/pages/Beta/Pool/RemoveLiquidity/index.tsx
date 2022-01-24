import React, { useState, useCallback } from 'react'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { PageWrapper, InputText, ContentBox, DataBox } from './styleds'
import { Box, Text, Button, Steps, Step } from '@pangolindex/components'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { TokenAmount, Currency, ChainId, JSBI } from '@pangolindex/sdk'
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

interface RemoveLiquidityProps {
  currencyA: Currency
  currencyB: Currency
}

const RemoveLiquidity = ({ currencyA, currencyB }: RemoveLiquidityProps) => {
  const { account, chainId, library } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { independentField } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  // const { parsedAmount, error } = useDerivedStakeInfo(
  //   typedValue,
  //   stakingInfo?.stakedAmount?.token,
  //   userLiquidityUnstaked
  // )
  // const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  // state for pending and submitted txn views

  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(4)
  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.AVALANCHE]
  )

  const isArgentWallet = false

  async function onAttemptToApprove() {
    // TODO: Translate using i18n
    if (!pairContract || !pair || !library || !deadline || !chainId || !account) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (isArgentWallet) {
      return approveCallback()
    }

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
    if (value === 4) {
      setTypedValue((userLiquidityUnstaked as TokenAmount).toExact())
    } else {
      const newAmount = (userLiquidityUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(value * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setTypedValue(newAmount.toSignificant(6))
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  const renderPoolDataRow = (label: string, value: string) => {
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
    // if there was a tx hash, we want to clear the input
    if (hash) {
      setTypedValue('')
    }
    setHash('')
  }, [setTypedValue, hash])

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

    const currencyBIsETH = currencyB === CAVAX
    const oneCurrencyIsETH = currencyA === CAVAX || currencyBIsETH

    // TODO: Translate using i18n
    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityAVAX
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityAVAX', 'removeLiquidityAVAXSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
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
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityAVAXWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityAVAXWithPermit', 'removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
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

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

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

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/')
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }

  return (
    <PageWrapper>
      <Box mt={10}>
        <InputText
          value={typedValue}
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
          // addonLabel={
          //   account && (
          //     <Text color="text2" fontWeight={500} fontSize={14}>
          //       {!!stakingInfo?.stakedAmount?.token && userLiquidityUnstaked
          //         ? t('earn.availableToDeposit') + userLiquidityUnstaked?.toSignificant(6)
          //         : ' -'}
          //     </Text>
          //   )
          // }
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
      {/* 
      <Box>
        <ContentBox>
          {renderPoolDataRow(
            t('migratePage.dollarWorth'),
            `${yourLiquidityAmount ? `$${yourLiquidityAmount?.toFixed(4)}` : '-'}`
          )}
          {renderPoolDataRow(
            `${t('dashboardPage.earned_dailyIncome')}`,
            `${hypotheticalRewardRate
              .multiply((60 * 60 * 24).toString())
              .toSignificant(4, { groupSeparator: ',' })} PNG`
          )}
        </ContentBox>
      </Box> */}
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
                  onRemove()
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
          stakeErrorMessage={error}
          parsedAmount={parsedAmount}
          attemptingTxn={attempting}
          txHash={hash}
          onClose={handleDismissConfirmation}
        />
      )}
    </PageWrapper>
  )
}
export default RemoveLiquidity

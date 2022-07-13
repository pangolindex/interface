import React, { useState, useEffect } from 'react'
import { Wrapper } from './styleds'
import { Box, Button, useLibrary, useTranslation } from '@pangolindex/components'
import { Pair, JSBI, TokenAmount } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'
import { useDerivedStakeInfo, useMinichefPools, StakingInfo } from '../../../state/stake/hooks'
import { tryParseAmount } from 'src/utils'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { RowBetween } from '../../Row'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { usePairContract, useStakingContract } from '../../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../../hooks/useApproveCallback'
import { TransactionResponse } from '@ethersproject/providers'
import { MINICHEF_ADDRESS } from '../../../constants'
import { splitSignature } from 'ethers/lib/utils'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import Loader from '../Loader'
import { useChainId } from 'src/hooks'

export interface StakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allChoosePoolLength: number
  setCompleted: () => void
  goBack: () => void
  choosePoolIndex: number
  setChoosePoolIndex: (value: number) => void
  isStakingLoading: boolean
}

const Stake = ({
  allChoosePool,
  allChoosePoolLength,
  setCompleted,
  goBack,
  choosePoolIndex,
  setChoosePoolIndex,
  isStakingLoading
}: StakeProps) => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { library, provider } = useLibrary()
  const { t } = useTranslation()

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [isValidAmount, setIsValidAmount] = useState(false as boolean)

  const pair = Object.values(allChoosePool)?.[choosePoolIndex]?.pair
  const stakingInfo = Object.values(allChoosePool)?.[choosePoolIndex]?.staking

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, pair.liquidityToken) as TokenAmount
  const [stakingAmount, setStakingAmount] = useState('')

  const { parsedAmount } = useDerivedStakeInfo(stakingAmount, stakingInfo.stakedAmount.token, userLiquidityUnstaked)

  const [stepIndex, setStepIndex] = useState(4)
  // approval data for stake
  const deadline = useTransactionDeadline()
  const [approval, approveCallback] = useApproveCallback(chainId, parsedAmount, MINICHEF_ADDRESS[chainId])
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  const onChangeAmount = (value: string) => {
    if (value === userLiquidityUnstaked.toExact()) {
      setStepIndex(4)
    } else {
      setStepIndex(0)
    }
    setStakingAmount(value)
    setSignatureData(null)
  }

  const onChangeDot = (value: number) => {
    setStepIndex(value)
    if (value === 4) {
      setStakingAmount(userLiquidityUnstaked.toExact())
    } else {
      const newAmount = userLiquidityUnstaked.multiply(JSBI.BigInt(value * 25)).divide(JSBI.BigInt(100)) as TokenAmount
      setStakingAmount(newAmount.toSignificant(6))
    }
  }

  const onMax = () => {
    setStepIndex(4)
    setStakingAmount(userLiquidityUnstaked.toExact())
  }

  useEffect(() => {
    setStakingAmount(userLiquidityUnstaked.toExact())
    setStepIndex(4)
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosePoolIndex, userLiquidityUnstaked.toFixed()])

  useEffect(() => {
    const stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(chainId, stakingAmount, stakingToken) as TokenAmount

    if (
      parsedInput &&
      stakingInfo?.stakedAmount &&
      JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw) &&
      JSBI.greaterThan(parsedInput.raw, JSBI.BigInt(0))
    ) {
      setIsValidAmount(true)
    } else {
      setIsValidAmount(false)
    }

    setSignatureData(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAmount])

  const stakingContract = useStakingContract(MINICHEF_ADDRESS[chainId])
  const poolMap = useMinichefPools()

  const pairContract = usePairContract(stakingInfo.stakedAmount.token.address)

  async function onStake() {
    const stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(chainId, stakingAmount, stakingToken) as TokenAmount

    if (
      stakingContract &&
      parsedInput &&
      userLiquidityUnstaked &&
      JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
    ) {
      let method, args

      if (approval === ApprovalState.APPROVED) {
        method = 'deposit'
        args = [poolMap[pair?.liquidityToken?.address], `0x${parsedAmount?.raw.toString(16)}`, account]
      } else if (signatureData) {
        method = 'depositWithPermit'
        args = [
          poolMap[pair?.liquidityToken?.address],
          `0x${parsedAmount?.raw.toString(16)}`,
          account,
          signatureData.deadline,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }

      setAttempting(true)

      await stakingContract[method](...args)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.depositLiquidity')
          })
          afterStake()
        })
        .catch((error: any) => console.error(error))
        .finally(() => setAttempting(false))
    }
  }

  async function onAttemptToApprove() {
    if (!stakingContract || !pairContract || !library || !deadline) throw new Error(t('earn.missingDependencies'))

    if (!parsedAmount) throw new Error(t('earn.missingLiquidityAmount'))

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
      verifyingContract: pairContract.address
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
      spender: stakingContract.address,
      value: parsedAmount.raw.toString(),
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
    ;(provider as any)
      .execute('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature: any) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch((error: any) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const afterStake = () => {
    if (choosePoolIndex === allChoosePoolLength - 1) {
      setCompleted()
    } else {
      const newIndex = choosePoolIndex + 1
      setChoosePoolIndex(newIndex)
      goBack()
    }
  }

  let errorMessage: string | undefined
  if (!account) {
    errorMessage = t('earn.connectWallet')
  }
  if (!userLiquidityUnstaked) {
    errorMessage = errorMessage ?? t('earn.enterAmount')
  }

  return (
    <Wrapper>
      {isStakingLoading ? (
        <Loader />
      ) : (
        <>
          <PoolInfo
            pair={pair}
            type="stake"
            stakingInfo={stakingInfo}
            stepIndex={stepIndex}
            onChangeDot={onChangeDot}
            amount={stakingAmount}
            onChangeAmount={onChangeAmount}
            userPoolBalance={userLiquidityUnstaked}
            onMax={onMax}
          />

          <Box mt={10}>
            <RowBetween>
              <Box mr="5px" width="100%">
                <Button
                  variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
                  onClick={onAttemptToApprove}
                  isDisabled={
                    attempting || approval !== ApprovalState.NOT_APPROVED || signatureData !== null || !isValidAmount
                  }
                  loading={attempting}
                  loadingText={t('migratePage.loading')}
                >
                  {t('earn.approve')}
                </Button>
              </Box>
              <Box width="100%">
                <Button
                  variant="primary"
                  isDisabled={
                    attempting ||
                    !!errorMessage ||
                    (signatureData === null && approval !== ApprovalState.APPROVED) ||
                    !isValidAmount
                  }
                  onClick={onStake}
                  loading={attempting}
                  loadingText={t('migratePage.loading')}
                >
                  {errorMessage ?? t('earn.deposit')}
                </Button>
              </Box>
            </RowBetween>
          </Box>
        </>
      )}
    </Wrapper>
  )
}
export default Stake

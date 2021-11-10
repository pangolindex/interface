import React, { useState, useEffect } from 'react'
import { Wrapper } from './styleds'
import { Box, Button } from '@pangolindex/components'
import { Pair, JSBI, TokenAmount } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'
import { StakingInfo } from '../../../state/stake/hooks'
import { tryParseAmount } from '../../../state/swap/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { RowBetween } from '../../Row'
import { useTranslation } from 'react-i18next'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useStakingContract } from '../../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../../hooks/useApproveCallback'
import { TransactionResponse } from '@ethersproject/providers'
import { MINICHEF_ADDRESS } from '../../../constants'
import { useDerivedStakeInfo, useMinichefPools } from '../../../state/stake/hooks'

export interface StakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allChoosePoolLength: number
  setCompleted: () => void
  goBack: () => void
  choosePoolIndex: number
  setChoosePoolIndex: (value: number) => void
}

const Stake = ({
  allChoosePool,
  allChoosePoolLength,
  setCompleted,
  goBack,
  choosePoolIndex,
  setChoosePoolIndex
}: StakeProps) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [isGreaterThan, setIsGreaterThan] = useState(false as boolean)

  let pair = Object.values(allChoosePool)?.[choosePoolIndex]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[choosePoolIndex]?.staking

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, pair.liquidityToken) as TokenAmount
  const [stakingAmount, setStakingAmount] = useState('')

  const { parsedAmount } = useDerivedStakeInfo(stakingAmount, stakingInfo.stakedAmount.token, userLiquidityUnstaked)

  const [stepIndex, setStepIndex] = useState(4)
  // approval data for stake
  const [approval, approveCallback] = useApproveCallback(parsedAmount, MINICHEF_ADDRESS)

  const onChangeAmount = (value: string) => {
    setStepIndex(0)
    setStakingAmount(value)
  }

  useEffect(() => {
    setStakingAmount(userLiquidityUnstaked.toSignificant(6))
    setStepIndex(4)
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosePoolIndex, userLiquidityUnstaked.toFixed()])

  useEffect(() => {
    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(stakingAmount, stakingToken) as TokenAmount

    if (parsedInput && stakingInfo?.stakedAmount && JSBI.greaterThan(parsedInput.raw, userLiquidityUnstaked.raw)) {
      setIsGreaterThan(true)
    } else {
      setIsGreaterThan(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAmount])

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const poolMap = useMinichefPools()

  const miniChefContract = useStakingContract(MINICHEF_ADDRESS)

  async function onStake() {
    setAttempting(true)

    let stakingToken = stakingInfo?.stakedAmount?.token

    const parsedInput = tryParseAmount(stakingAmount, stakingToken) as TokenAmount

    if (
      miniChefContract &&
      stakingContract &&
      parsedInput &&
      userLiquidityUnstaked &&
      JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
    ) {
      if (approval === ApprovalState.APPROVED) {
        // stakingContract
        //   .stake(`0x${parsedInput.raw.toString(16)}`, { gasLimit: 350000 })
        miniChefContract
          .deposit(poolMap[pair?.liquidityToken?.address], `0x${parsedAmount?.raw.toString(16)}`, account)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })

            setAttempting(false)
            afterStake()
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    }
  }

  async function onAttemptToApprove() {
    const liquidityAmount = stakingAmount
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    approveCallback().catch(error => {
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

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!userLiquidityUnstaked) {
    error = error ?? t('earn.enterAmount')
  }

  return (
    <Wrapper>
      <PoolInfo
        pair={pair}
        type="stake"
        stepIndex={stepIndex}
        onChangeDot={(value: number) => {
          setStepIndex(value)
          if (value === 4) {
            setStakingAmount(userLiquidityUnstaked.toSignificant(6))
          } else {
            const newAmount = (userLiquidityUnstaked as TokenAmount)
              .multiply(JSBI.BigInt(value * 25))
              .divide(JSBI.BigInt(100)) as TokenAmount
            setStakingAmount(newAmount.toSignificant(6))
          }
        }}
        amount={stakingAmount}
        onChangeAmount={(value: string) => {
          onChangeAmount(value)
        }}
        userPoolBalance={userLiquidityUnstaked}
      />

      <Box mt={10}>
        <RowBetween>
          <Box mr="5px" width="100%">
            <Button
              variant={approval === ApprovalState.APPROVED ? 'confirm' : 'primary'}
              onClick={onAttemptToApprove}
              isDisabled={attempting || approval !== ApprovalState.NOT_APPROVED || isGreaterThan}
              loading={attempting}
              loadingText={t('migratePage.loading')}
            >
              {t('earn.approve')}
            </Button>
          </Box>
          <Box width="100%">
            <Button
              variant="primary"
              isDisabled={attempting || !!error || approval !== ApprovalState.APPROVED || isGreaterThan}
              onClick={onStake}
              loading={attempting}
              loadingText={t('migratePage.loading')}
            >
              {error ?? t('earn.deposit')}
            </Button>
          </Box>
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default Stake

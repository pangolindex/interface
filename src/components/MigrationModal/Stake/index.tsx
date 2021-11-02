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
import { useDerivedStakeInfo } from '../../../state/stake/hooks'

export interface StackProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allChoosePoolLength: number
  setCompleted: () => void
}

const Stake = ({ allChoosePool, allChoosePoolLength, setCompleted }: StackProps) => {
  const { account } = useActiveWeb3React()

  const [index, setIndex] = useState(0)

  const { t } = useTranslation()

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [isGreaterThan, setIsGreaterThan] = useState(false as boolean)

  let pair = Object.values(allChoosePool)?.[index]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[index]?.staking

  // const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  // let initalAmount: TokenAmount = new TokenAmount(stakingInfo.rewardRate.token, '0')
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, pair.liquidityToken) as TokenAmount
  const [stakingAmount, setStakingAmount] = useState('')

  const { parsedAmount } = useDerivedStakeInfo(stakingAmount, stakingInfo.stakedAmount.token, userLiquidityUnstaked)
  const [percentage, setPercentage] = useState(0)
  // approval data for stake
  const [approval, approveCallback] = useApproveCallback(parsedAmount, stakingInfo.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  useEffect(() => {
    if (percentage) {
      const newAmount = (userLiquidityUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(percentage * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setStakingAmount(newAmount.toSignificant(4))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])

  const onChangeAmount = (value: string) => {
    setPercentage(0)
    setStakingAmount(value)
  }

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

  async function onStake() {
    setAttempting(true)

    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(stakingAmount, stakingToken) as TokenAmount

    if (
      stakingContract &&
      parsedInput &&
      userLiquidityUnstaked &&
      JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
    ) {
      if (approval === ApprovalState.APPROVED) {
        stakingContract
          .stake(`0x${parsedInput.raw.toString(16)}`, { gasLimit: 350000 })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
            afterStake()
            setAttempting(false)
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
    if (index === allChoosePoolLength - 1) {
      setCompleted()
    } else {
      const newIndex = index + 1
      setIndex(newIndex)
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
        percentage={percentage}
        onChangePercentage={(value: number) => {
          setPercentage(value)
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
            >
              {t('earn.approve')} {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
            </Button>
          </Box>
          <Box width="100%">
            <Button
              variant="primary"
              isDisabled={attempting || !!error || approval !== ApprovalState.APPROVED || isGreaterThan}
              onClick={onStake}
              loading={attempting}
            >
              {error ?? t('earn.deposit')} {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
            </Button>
          </Box>
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default Stake

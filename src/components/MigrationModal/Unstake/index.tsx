import React, { useState, useEffect } from 'react'
import { Wrapper } from './styleds'
import { Box, Button } from '@pangolindex/components'
import { Pair, JSBI, TokenAmount } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'
import { StakingInfo } from '../../../state/stake/hooks'
import { tryParseAmount } from '../../../state/swap/hooks'
import { useStakingContract } from '../../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../../hooks'

export interface UnstakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  goNext: () => void
  allChoosePoolLength: number
}

const Unstake = ({ allChoosePool, goNext, allChoosePoolLength }: UnstakeProps) => {
  const { account } = useActiveWeb3React()

  const [index, setIndex] = useState(0)
  const [attempting, setAttempting] = useState(false as boolean)

  const { t } = useTranslation()

  let pair = Object.values(allChoosePool)?.[index]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[index]?.staking

  const [unStackingAmount, setUnstackingAmount] = useState(stakingInfo?.stakedAmount as TokenAmount)

  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (percentage) {
      const newAmount = stakingInfo?.stakedAmount
        .multiply(JSBI.BigInt(percentage * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setUnstackingAmount(newAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])

  useEffect(() => {
    setUnstackingAmount(stakingInfo?.stakedAmount)
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, stakingInfo])

  const onChangeAmount = (value: string) => {
    let stakingToken = stakingInfo?.stakedAmount?.token
    setPercentage(0)
    const parsedInput = tryParseAmount(value, stakingToken) as TokenAmount

    if (
      parsedInput &&
      stakingInfo?.stakedAmount &&
      JSBI.lessThanOrEqual(parsedInput.raw, stakingInfo?.stakedAmount.raw)
    ) {
      setUnstackingAmount(parsedInput)
    }
  }

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.withdrawDepositedLiquidity')
          })
          // setHash(response.hash)
          onUnstake()
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  const onUnstake = () => {
    if (index === allChoosePoolLength - 1) {
      goNext()
    } else {
      const newIndex = index + 1
      setIndex(newIndex)
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('earn.enterAmount')
  }

  return (
    <Wrapper>
      <PoolInfo
        pair={pair}
        type="unstake"
        stakingInfo={stakingInfo}
        percentage={percentage}
        onChangePercentage={(value: number) => {
          setPercentage(value)
        }}
        amount={unStackingAmount}
        onChangeAmount={(value: string) => {
          onChangeAmount(value)
        }}
      />

      <Box mt={10}>
        <Button
          variant="primary"
          onClick={() => {
            onWithdraw()
          }}
          loading={attempting}
          isDisabled={!!error || attempting}
        >
          {error ?? t('migratePage.unstake')} {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
        </Button>
      </Box>
    </Wrapper>
  )
}
export default Unstake

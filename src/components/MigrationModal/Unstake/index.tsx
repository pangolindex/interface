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
import { RowBetween } from '../../Row'

export interface UnstakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  goNext: () => void
  allChoosePoolLength: number
  goBack: () => void
}

const Unstake = ({ allChoosePool, goNext, allChoosePoolLength, goBack }: UnstakeProps) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [index, setIndex] = useState(0)
  const [attempting, setAttempting] = useState(false as boolean)
  const [isGreaterThan, setIsGreaterThan] = useState(false as boolean)

  let pair = Object.values(allChoosePool)?.[index]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[index]?.staking

  const [unStackingAmount, setUnstackingAmount] = useState('')
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (percentage) {
      const newAmount = stakingInfo?.stakedAmount
        .multiply(JSBI.BigInt(percentage * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setUnstackingAmount(newAmount?.toSignificant(6))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])

  useEffect(() => {
    setUnstackingAmount(stakingInfo?.stakedAmount?.toSignificant(6))
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, stakingInfo])

  useEffect(() => {
    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(unStackingAmount, stakingToken) as TokenAmount

    if (parsedInput && stakingInfo?.stakedAmount && JSBI.greaterThan(parsedInput.raw, stakingInfo?.stakedAmount.raw)) {
      setIsGreaterThan(true)
    } else {
      setIsGreaterThan(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unStackingAmount])

  const onChangeAmount = (value: string) => {
    setPercentage(0)
    setUnstackingAmount(value)
  }

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(unStackingAmount, stakingToken) as TokenAmount

    if (
      stakingContract &&
      parsedInput &&
      stakingInfo?.stakedAmount &&
      JSBI.lessThanOrEqual(parsedInput.raw, stakingInfo?.stakedAmount.raw)
    ) {
      setAttempting(true)
      await stakingContract

        .withdraw(`0x${parsedInput.raw.toString(16)}`)
        //.exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.withdrawDepositedLiquidity')
          })
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
        <RowBetween>
          {index === 0 && (
            <Box mr="5px" width="100%">
              <Button variant="primary" onClick={goBack} isDisabled={!!error || attempting} loading={attempting}>
                {t('migratePage.back')}
              </Button>
            </Box>
          )}

          <Box width="100%">
            <Button
              variant="primary"
              onClick={() => {
                onWithdraw()
              }}
              loading={attempting}
              isDisabled={!!error || attempting || isGreaterThan}
            >
              {attempting ? t('migratePage.loading') : t('migratePage.unstake')}{' '}
              {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
            </Button>
          </Box>
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default Unstake

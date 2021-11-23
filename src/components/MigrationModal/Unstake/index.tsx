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
  goBack: () => void
  choosePoolIndex: number
}

const Unstake = ({ allChoosePool, goNext, goBack, choosePoolIndex }: UnstakeProps) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [attempting, setAttempting] = useState(false as boolean)
  const [isValidAmount, setIsValidAmount] = useState(false as boolean)

  let pair = Object.values(allChoosePool)?.[choosePoolIndex]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[choosePoolIndex]?.staking

  const [unStakingAmount, setUnstakingAmount] = useState('')
  const [stepIndex, setStepIndex] = useState(4)

  useEffect(() => {
    setUnstakingAmount(stakingInfo?.stakedAmount?.toExact())
    setStepIndex(4)
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosePoolIndex, stakingInfo])

  useEffect(() => {
    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(unStakingAmount, stakingToken) as TokenAmount

    if (parsedInput
      && stakingInfo?.stakedAmount
      && JSBI.lessThanOrEqual(parsedInput.raw, stakingInfo?.stakedAmount.raw)
      && JSBI.greaterThan(parsedInput.raw, JSBI.BigInt(0))
    ) {
      setIsValidAmount(true)
    } else {
      setIsValidAmount(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unStakingAmount])

  const onChangeAmount = (value: string) => {
    if (value === stakingInfo?.stakedAmount?.toExact()) {
      setStepIndex(4)
    } else {
      setStepIndex(0)
    }
    setUnstakingAmount(value)
  }

  const onChangeDot = (value: number) => {
    setStepIndex(value)
    if (value === 4) {
      setUnstakingAmount(stakingInfo?.stakedAmount?.toExact())
    } else {
      const newAmount = stakingInfo?.stakedAmount
        .multiply(JSBI.BigInt(value * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setUnstakingAmount(newAmount?.toSignificant(6))
    }
  }

  const onMax = () => {
    setStepIndex(4)
    setUnstakingAmount(stakingInfo?.stakedAmount?.toExact())
  }

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    if (
      stakingContract &&
      stakingInfo?.stakedAmount?.greaterThan('0')
    ) {
      setAttempting(true)
      await stakingContract
        .exit()
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.withdrawDepositedLiquidity')
          })
          goNext()
        })
        .catch((error: any) => console.log(error))
        .finally(() => setAttempting(false))
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
        stepIndex={stepIndex}
        onChangeDot={onChangeDot}
        amount={unStakingAmount}
        onChangeAmount={onChangeAmount}
        onMax={onMax}
      />

      <Box mt={10}>
        <RowBetween>
          {choosePoolIndex === 0 && (
            <Box mr="5px" width="100%">
              <Button variant="outline" onClick={goBack} isDisabled={!!error || attempting} loading={attempting}>
                {t('migratePage.back')}
              </Button>
            </Box>
          )}

          <Box width="100%">
            <Button
              variant="primary"
              onClick={onWithdraw}
              loading={attempting}
              isDisabled={!!error || attempting || !isValidAmount}
              loadingText={t('migratePage.loading')}
            >
              {t('migratePage.unstake')}
            </Button>
          </Box>
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default Unstake

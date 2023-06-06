import React, { useState, useEffect } from 'react'
import { Wrapper } from './styleds'
import {
  Box,
  Button,
  useTranslation,
  MinichefStakingInfo,
  useStakingContract,
  useActiveWeb3React
} from '@pangolindex/components'
import { Pair, JSBI, TokenAmount } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'
import { tryParseAmount } from 'src/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { RowBetween } from '../../Row'
import { useChainId } from 'src/hooks'

export interface UnstakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: MinichefStakingInfo } }
  goNext: () => void
  goBack: () => void
  choosePoolIndex: number
}

const Unstake = ({ allChoosePool, goNext, goBack, choosePoolIndex }: UnstakeProps) => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { t } = useTranslation()
  const [attempting, setAttempting] = useState(false as boolean)
  const [isValidAmount, setIsValidAmount] = useState(false as boolean)

  const pair = Object.values(allChoosePool)?.[choosePoolIndex]?.pair
  const stakingInfo = Object.values(allChoosePool)?.[choosePoolIndex]?.staking

  const [unStakingAmount, setUnstakingAmount] = useState('')
  const [stepIndex, setStepIndex] = useState(4)

  useEffect(() => {
    setUnstakingAmount(stakingInfo?.stakedAmount?.toExact())
    setStepIndex(4)
    setAttempting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosePoolIndex, stakingInfo])

  useEffect(() => {
    const stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(chainId, unStakingAmount, stakingToken) as TokenAmount

    if (
      parsedInput &&
      stakingInfo?.stakedAmount &&
      JSBI.lessThanOrEqual(parsedInput.raw, stakingInfo?.stakedAmount.raw) &&
      JSBI.greaterThan(parsedInput.raw, JSBI.BigInt(0))
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
    if (stakingContract && stakingInfo?.stakedAmount?.greaterThan('0')) {
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

  let errorMessage: string | undefined
  if (!account) {
    errorMessage = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    errorMessage = errorMessage ?? t('earn.enterAmount')
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
              <Button variant="outline" onClick={goBack} isDisabled={!!errorMessage || attempting} loading={attempting}>
                {t('migratePage.back')}
              </Button>
            </Box>
          )}

          <Box width="100%">
            <Button
              variant="primary"
              onClick={onWithdraw}
              loading={attempting}
              isDisabled={!!errorMessage || attempting || !isValidAmount}
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

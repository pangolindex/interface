import React, { useState } from 'react'
import { Box, Button } from '@pangolindex/components'
import { WithdrawWrapper, RewardWrapper, Root, StatWrapper } from './styleds'
import { StakingInfo, useMinichefPools, useMinichefPendingRewards, useGetEarnedAmount } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useStakingContract } from 'src/hooks/useContract'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'
import Stat from 'src/components/Stat'

interface WithdrawProps {
  stakingInfo: StakingInfo
  version: number
  onClose: () => void
}
const Withdraw = ({ stakingInfo, version, onClose }: WithdrawProps) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  const poolMap = useMinichefPools()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  const isSuperFarm = (rewardTokensAmount || [])?.length > 0

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onClose()
  }

  async function onWithdraw() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'exit' : 'withdrawAndHarvest'
      const args =
        version < 2
          ? []
          : [
              poolMap[stakingInfo.stakedAmount.token.address],
              `0x${stakingInfo.stakedAmount?.raw.toString(16)}`,
              account
            ]

      // TODO: Support withdrawing partial amounts for v2+
      try {
        const response: TransactionResponse = await stakingContract[method](...args)
        await response.wait(1)
        addTransaction(response, {
          summary: t('earn.withdrawDepositedLiquidity')
        })
        setHash(response.hash)
      } catch (err) {
        setAttempting(false)
        const _err = err as any
        // we only care if the error is something _other_ than the user rejected the tx
        if (_err?.code !== 4001) {
          console.error(err)
        }
      }
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('earn.enterAmount')
  }

  const { earnedAmount } = useGetEarnedAmount(stakingInfo?.pid as string)

  const newEarnedAmount = version < 2 ? stakingInfo?.earnedAmount : earnedAmount

  return (
    <WithdrawWrapper>
      {!attempting && !hash && (
        <Root>
          <Box flex="1">
            <RewardWrapper>
              {stakingInfo?.stakedAmount && (
                <StatWrapper>
                  <Stat
                    title={t('earn.unclaimedReward', { symbol: 'PGL' })}
                    stat={stakingInfo?.stakedAmount?.toSignificant(4)}
                    titlePosition="top"
                    titleFontSize={12}
                    statFontSize={24}
                    titleColor="text1"
                    statAlign="center"
                  />
                </StatWrapper>
              )}
              {newEarnedAmount && (
                <StatWrapper>
                  <Stat
                    title={t('earn.unclaimedReward', { symbol: 'PNG' })}
                    stat={newEarnedAmount?.toSignificant(4)}
                    titlePosition="top"
                    titleFontSize={12}
                    statFontSize={24}
                    titleColor="text1"
                    statAlign="center"
                  />
                </StatWrapper>
              )}

              {isSuperFarm &&
                rewardTokensAmount?.map((rewardAmount, i) => (
                  <StatWrapper key={i}>
                    <Stat
                      title={t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}
                      stat={rewardAmount?.toSignificant(4)}
                      titlePosition="top"
                      titleFontSize={12}
                      statFontSize={24}
                      titleColor="text1"
                      statAlign="center"
                    />
                  </StatWrapper>
                ))}
            </RewardWrapper>
          </Box>

          <Box my={'10px'}>
            <Button variant="primary" onClick={onWithdraw}>
              {error ?? t('earn.withdrawAndClaim')}
            </Button>
          </Box>
        </Root>
      )}

      {attempting && !hash && <Loader size={100} label="Withdrawing & Claiming..." />}

      {hash && (
        <TransactionCompleted
          onClose={wrappedOnDismiss}
          submitText={`${t('earn.withdrewStakingToken', { symbol: 'PGL' })} & ${t('earn.claimedReward', {
            symbol: 'PNG'
          })}`}
        />
      )}
    </WithdrawWrapper>
  )
}
export default Withdraw

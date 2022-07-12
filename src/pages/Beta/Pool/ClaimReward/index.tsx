import React, { useState } from 'react'
import { Box, Text, Button, useTranslation } from '@pangolindex/components'
import { ClaimWrapper, Root, RewardWrapper, StatWrapper } from './styleds'
import { StakingInfo, useMinichefPendingRewards, useGetEarnedAmount } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useMinichefPools } from 'src/state/stake/hooks'
import { useStakingContract } from 'src/hooks/useContract'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'
import Stat from 'src/components/Stat'

interface ClaimProps {
  stakingInfo: StakingInfo
  version: number
  onClose: () => void
}
const ClaimReward = ({ stakingInfo, version, onClose }: ClaimProps) => {
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

  async function onClaimReward() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'getReward' : 'harvest'
      const args = version < 2 ? [] : [poolMap[stakingInfo.stakedAmount.token.address], account]

      try {
        const response: TransactionResponse = await stakingContract[method](...args)
        await response.wait(1)
        addTransaction(response, {
          summary: t('earn.claimAccumulated', { symbol: 'PNG' })
        })
        setHash(response.hash)
      } catch (error) {
        setAttempting(false)
        const err = error as any
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
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
    <ClaimWrapper>
      {!attempting && !hash && (
        <Root>
          <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
            <RewardWrapper isSuperFarm={isSuperFarm}>
              <StatWrapper>
                <Stat
                  title={t('earn.unclaimedReward', { symbol: 'PNG' })}
                  stat={newEarnedAmount?.toSignificant(4)}
                  titlePosition="top"
                  titleFontSize={12}
                  statFontSize={[24, 18]}
                  titleColor="text1"
                  statAlign="center"
                />
              </StatWrapper>

              {isSuperFarm &&
                rewardTokensAmount?.map((rewardAmount, i) => (
                  <StatWrapper key={i}>
                    <Stat
                      title={t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}
                      stat={rewardAmount?.toSignificant(4)}
                      titlePosition="top"
                      titleFontSize={12}
                      statFontSize={[24, 18]}
                      titleColor="text1"
                      statAlign="center"
                    />
                  </StatWrapper>
                ))}
            </RewardWrapper>

            <Text fontSize="13px" color="text2" textAlign="center">
              {t('earn.liquidityRemainsPool')}
            </Text>
          </Box>

          <Box my={'10px'}>
            <Button variant="primary" onClick={onClaimReward}>
              {error ?? t('earn.claimReward', { symbol: 'PNG' })}
            </Button>
          </Box>
        </Root>
      )}

      {attempting && !hash && <Loader size={100} label=" Claiming..." />}

      {hash && <TransactionCompleted onClose={wrappedOnDismiss} submitText="Your rewards claimed" />}
    </ClaimWrapper>
  )
}
export default ClaimReward

import React, { useState } from 'react'
import { Box, Text, Button } from '@pangolindex/components'
import { PageWrapper, Root, RewardWrapper } from './styleds'
import { StakingInfo, useMinichefPendingRewards } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
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

  let isSuperFarm = (rewardTokensAmount || [])?.length > 0

  async function onClaimReward() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'getReward' : 'harvest'
      const args = version < 2 ? [] : [poolMap[stakingInfo.stakedAmount.token.address], account]

      await stakingContract[method](...args)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.claimAccumulated', { symbol: 'PNG' })
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
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
    <PageWrapper>
      {!attempting && !hash && (
        <Root>
          <Box flex="1">
            <RewardWrapper>
              <Box textAlign="center">
                <Stat
                  title={t('earn.unclaimedReward', { symbol: 'PNG' })}
                  stat={stakingInfo?.earnedAmount?.toSignificant(6)}
                  titlePosition="top"
                  titleFontSize={12}
                  statFontSize={24}
                  titleColor="text1"
                />
              </Box>

              {isSuperFarm &&
                rewardTokensAmount?.map((rewardAmount, i) => (
                  <Box textAlign="center" key={i}>
                    <Stat
                      title={t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}
                      stat={rewardAmount?.toSignificant(6)}
                      titlePosition="top"
                      titleFontSize={12}
                      statFontSize={24}
                      titleColor="text1"
                    />
                  </Box>
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

      {hash && <TransactionCompleted onClose={onClose} submitText="Your rewards claimed" />}
    </PageWrapper>
  )
}
export default ClaimReward

import React, { useState, useEffect } from 'react'
import { Box, Button, useTranslation } from '@pangolindex/components'
import { FarmRemoveWrapper, RewardWrapper, Root, StatWrapper } from './styleds'
import { StakingInfo, useMinichefPools, useMinichefPendingRewards, useGetEarnedAmount } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useStakingContract } from 'src/hooks/useContract'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'
import Stat from 'src/components/Stat'
import RemoveLiquidityDrawer from '../RemoveLiquidityDrawer'

interface RemoveFarmProps {
  stakingInfo: StakingInfo
  version: number
  onClose: () => void
  // this prop will be used if user move away from first step
  onLoadingOrComplete?: (value: boolean) => void
}
const RemoveFarm = ({ stakingInfo, version, onClose, onLoadingOrComplete }: RemoveFarmProps) => {
  const { account } = useActiveWeb3React()
  const [isRemoveLiquidityDrawerVisible, setShowRemoveLiquidityDrawer] = useState(false)
  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  const poolMap = useMinichefPools()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  const isSuperFarm = (rewardTokensAmount || [])?.length > 0

  useEffect(() => {
    if (onLoadingOrComplete) {
      if (hash || attempting) {
        onLoadingOrComplete(true)
      } else {
        onLoadingOrComplete(false)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, attempting])

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

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  return (
    <FarmRemoveWrapper>
      {!attempting && !hash && (
        <Root>
          <Box flex="1">
            <RewardWrapper>
              {stakingInfo?.stakedAmount && (
                <StatWrapper>
                  <Stat
                    title={t('earn.depositedToken', { symbol: 'PGL' })}
                    stat={stakingInfo?.stakedAmount?.toSignificant(4)}
                    titlePosition="top"
                    titleFontSize={12}
                    statFontSize={[20, 18]}
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
                    statFontSize={[20, 18]}
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
                      statFontSize={[20, 18]}
                      titleColor="text1"
                      statAlign="center"
                    />
                  </StatWrapper>
                ))}
            </RewardWrapper>
          </Box>

          <Box>
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
          submitText={t('pool.successWithdraw')}
          isShowButtton={true}
          onButtonClick={() => setShowRemoveLiquidityDrawer(true)}
          buttonText={t('navigationTabs.removeLiquidity')}
        />
      )}

      {isRemoveLiquidityDrawerVisible && (
        <RemoveLiquidityDrawer
          isOpen={isRemoveLiquidityDrawerVisible}
          onClose={() => {
            setShowRemoveLiquidityDrawer(false)
            wrappedOnDismiss()
          }}
          clickedLpTokens={[token0, token1]}
        />
      )}
    </FarmRemoveWrapper>
  )
}
export default RemoveFarm

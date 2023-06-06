import React, { useState } from 'react'
import {
  Box,
  Text,
  Button,
  useTranslation,
  TransactionCompleted,
  Loader,
  useStakingContract,
  useActiveWeb3React
} from '@pangolindex/components'
import { WidgetWrapper, Root } from './styled'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'

interface ClaimProps {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
  onClickRewardStake?: () => void
}

const ClaimWidget = ({ stakingInfo, onClose, onClickRewardStake }: ClaimProps) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()
  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onClose()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onClaimReward() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)

      try {
        const response: TransactionResponse = await stakingContract.getReward({ gasLimit: 350000 })
        await response.wait(1)
        addTransaction(response, {
          summary: t('earn.claimAccumulated', { symbol: stakingInfo?.rewardToken?.symbol })
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

  let errorMessage: string | undefined
  if (!account) {
    errorMessage = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    errorMessage = errorMessage ?? t('earn.enterAmount')
  }

  return (
    <WidgetWrapper>
      {!attempting && !hash && (
        <Root>
          <Box textAlign="center" display="flex" flexDirection="column" justifyContent="center">
            <Text fontSize={['26px', '22px']} fontWeight={500} color="text1">
              {stakingInfo?.earnedAmount?.toSignificant(6)}
            </Text>

            <Text fontSize={['16px', '14px']} color="text1">
              {t('earn.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}
            </Text>

            <Text fontSize={['14px', '12px']} color="text2" textAlign="center" mt={20}>
              Claim your rewards
            </Text>
          </Box>
          <Box mt={'10px'}>
            <Button variant="primary" isDisabled={!!errorMessage} onClick={onClaimReward} padding="15px 18px">
              {errorMessage ?? t('earnPage.claim')}
            </Button>
          </Box>
        </Root>
      )}

      {attempting && !hash && <Loader size={100} label="Claiming..." />}

      {hash && (
        <TransactionCompleted
          onClose={wrappedOnDismiss}
          submitText="Your rewards claimed"
          isShowButtton={true}
          onButtonClick={() => onClickRewardStake && onClickRewardStake()}
          buttonText="Stake"
        />
      )}
    </WidgetWrapper>
  )
}
export default ClaimWidget

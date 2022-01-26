import React, { useState } from 'react'
import { Box, Text, Button } from '@pangolindex/components'
import { WidgetWrapper, PendingWrapper, Root } from './styled'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useStakingContract } from 'src/hooks/useContract'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import TransactionSubmitted from 'src/components/Beta/TransactionSubmitted'

interface ClaimProps {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const ClaimWidget = ({ stakingInfo, onClose }: ClaimProps) => {
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
      await stakingContract
        .getReward({ gasLimit: 350000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.claimAccumulated', { symbol: stakingInfo?.rewardToken?.symbol })
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
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
    <WidgetWrapper>
      {!attempting && !hash && (
        <Root>
          <Box textAlign="center">
            <Text fontSize="26px" fontWeight={500} color="text1">
              {stakingInfo?.earnedAmount?.toSignificant(6)}
            </Text>

            <Text fontSize="16px" color="text1">
              {t('earn.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}
            </Text>

            <Text fontSize="14px" color="text2" textAlign="center" mt={20}>
              {t('earn.liquidityRemainsPool')}
            </Text>
          </Box>
          <Box mt={'10px'}>
            <Button variant="primary" isDisabled={!!error} onClick={onClaimReward}>
              {error ?? t('earn.claimReward', { symbol: stakingInfo?.rewardToken?.symbol })}
            </Button>
          </Box>
        </Root>
      )}

      {attempting && !hash && (
        <PendingWrapper>
          <Box mb={'15px'}>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </Box>
          <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
            {t('earn.claim')}
          </Text>
          <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
            {t('earn.claimingReward', {
              amount: stakingInfo?.earnedAmount?.toSignificant(6),
              symbol: stakingInfo?.rewardToken?.symbol
            })}
          </Text>
        </PendingWrapper>
      )}
      {hash && <TransactionSubmitted hash={hash} onClose={wrappedOnDismiss} />}
    </WidgetWrapper>
  )
}
export default ClaimWidget

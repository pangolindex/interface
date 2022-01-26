import React, { useContext, useState } from 'react'
import { Box, Text, Button } from '@pangolindex/components'
import { WidgetWrapper, PendingWrapper, SubmittedWrapper, Root, Link } from './styleds'
import { ArrowUpCircle } from 'react-feather'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useStakingContract } from 'src/hooks/useContract'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { getEtherscanLink } from 'src/utils'
import { ThemeContext } from 'styled-components'

interface ClaimProps {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const ClaimWidget = ({ stakingInfo, onClose }: ClaimProps) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
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
      {hash && (
        <SubmittedWrapper>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
            <Box flex="1" display="flex" alignItems="center">
              <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
            </Box>
            <Text fontWeight={500} fontSize={20} color="text1">
              {t('earn.transactionSubmitted')}
            </Text>
            {chainId && hash && (
              <Link
                as="a"
                fontWeight={500}
                fontSize={14}
                color={'primary1'}
                href={getEtherscanLink(chainId, hash, 'transaction')}
              >
                {t('transactionConfirmation.viewExplorer')}
              </Link>
            )}
          </Box>
          <Button variant="primary" onClick={() => wrappedOnDismiss()}>
            {t('transactionConfirmation.close')}
          </Button>
        </SubmittedWrapper>
      )}
    </WidgetWrapper>
  )
}
export default ClaimWidget

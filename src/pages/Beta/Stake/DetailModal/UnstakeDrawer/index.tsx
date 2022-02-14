import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from 'src/components/Drawer'
import { useActiveWeb3React } from 'src/hooks'
import { useStakingContract } from 'src/hooks/useContract'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { Box, Button, Text } from '@pangolindex/components'
import { ConfirmWrapper, PendingWrapper, Wrapper } from './styled'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'

type Props = {
  isOpen: boolean
  onClose: () => void
  stakingInfo: SingleSideStakingInfo
}

const UnstakeDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

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

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.withdrawDepositedLiquidity')
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
    <Drawer title={t('earnPage.unstake')} isOpen={isOpen} onClose={wrappedOnDismiss}>
      <Wrapper>
        {!attempting && !hash && (
          <ConfirmWrapper>
            <Box display="flex" alignItems="center">
              <Box width="50%">
                <Text fontSize="26px" fontWeight={500} color="text1">
                  {stakingInfo.stakedAmount?.toSignificant(6)}
                </Text>
                <Text fontSize="16px" fontWeight={500} color="text1">
                  {t('earn.depositedToken', { symbol: 'PNG' })}
                </Text>
              </Box>
              <Box width="50%">
                <Text fontSize="26px" fontWeight={500} color="text1">
                  {stakingInfo.earnedAmount?.toSignificant(6)}
                </Text>
                <Text fontSize="16px" fontWeight={500} color="text1">
                  {t('earn.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}
                </Text>
              </Box>
            </Box>
            <Text fontSize="14px" color="text2" mt={20}>
              {t('earn.whenYouWithdrawSingleSideWarning', { symbol: stakingInfo?.rewardToken?.symbol })}
            </Text>
            <Box flex={1} />
            <Box mt={'10px'}>
              <Button variant="primary" isDisabled={!!error} onClick={onWithdraw}>
                {error ?? t('earn.withdrawAndClaim')}
              </Button>
            </Box>
          </ConfirmWrapper>
        )}
        {attempting && !hash && (
          <PendingWrapper>
            <Box mb={'15px'}>
              <Loader size={100} label="Unstaking" />
            </Box>
          </PendingWrapper>
        )}
        {hash && <TransactionCompleted onClose={wrappedOnDismiss} submitText="Unstaked" />}
      </Wrapper>
    </Drawer>
  )
}

export default UnstakeDrawer

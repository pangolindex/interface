import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TransactionResponse } from '@ethersproject/providers'
import { Text } from '@pangolindex/components'

import { RowBetween } from '../../Row'
import { ButtonError } from '../../Button'
import { SubmittedView, LoadingView } from '../../Beta/ModalViews'
import FormattedCurrencyAmount from '../../FormattedCurrencyAmount'
import Modal from '../../Modal'
import { AutoColumn } from '../../Column'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { useStakingContract } from 'src/hooks/useContract'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { TYPE } from 'src/theme'
import { useActiveWeb3React } from 'src/hooks'

import CrossIcon from 'src/assets/svg/cross.svg'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1.563rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: SingleSideStakingInfo
}

export default function UnstakingModalSingleSide({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
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
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90} isBeta={true}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <Text fontSize={18} fontWeight={600} lineHeight={'27px'} color="text10">
              {t('earn.withdraw')}
            </Text>
            <img src={CrossIcon} onClick={wrappedOnDismiss} alt="cross icon" style={{ cursor: 'pointer' }} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={24}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.depositedToken', { symbol: 'PNG' })}</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={24}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}</TYPE.body>
            </AutoColumn>
          )}
          <Text fontSize={12} lineHeight={'18px'} fontWeight={'normal'} color="text14" style={{ textAlign: 'center' }}>
            {t('earn.whenYouWithdrawSingleSideWarning', { symbol: stakingInfo?.rewardToken?.symbol })}
          </Text>

          <Text fontSize={12} lineHeight={'18px'} fontWeight={'normal'} color="text15" style={{ textAlign: 'center' }}>
            {t('header.addMetamask')}
          </Text>

          <ButtonError
            isBeta={true}
            disabled={!!error}
            error={!!error && !!stakingInfo?.stakedAmount}
            onClick={onWithdraw}
          >
            {error ?? t('earn.withdrawAndClaim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontSize={18} lineHeight={'27px'} fontWeight={600} color="text10">
              {t('earn.withdrawingLiquidity', {
                amount: stakingInfo?.stakedAmount?.toSignificant(4),
                symbol: 'PNG'
              })}
            </Text>
            <Text fontSize={16} lineHeight={'24px'} fontWeight={400} color="text10">
              {t('earn.claimingReward', {
                amount: stakingInfo?.earnedAmount?.toSignificant(4),
                symbol: stakingInfo?.rewardToken?.symbol
              })}
            </Text>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.withdrewStakingToken', { symbol: 'PNG' })}</TYPE.body>
            <TYPE.body fontSize={20}>{t('earn.claimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}

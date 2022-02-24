import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { SingleSideStakingInfo } from '../../state/stake/hooks'
import { useStakingContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { ChainId } from '@antiyro/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: SingleSideStakingInfo
}

export default function ClaimRewardModalSingleSide({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
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

  const { chainId } = useActiveWeb3React()

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress[chainId || ChainId.AVALANCHE])

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
		<Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
			{!attempting && !hash && (
				<ContentWrapper gap="lg">
					<RowBetween>
						<TYPE.mediumHeader>{t('earn.claim')}</TYPE.mediumHeader>
						<CloseIcon onClick={wrappedOnDismiss} />
					</RowBetween>
					{stakingInfo?.earnedAmount && (
						<AutoColumn justify="center" gap="md">
							<TYPE.body fontWeight={600} fontSize={36}>
								{stakingInfo?.earnedAmount?.toSignificant(6)}
							</TYPE.body>
							<TYPE.body>{t('earn.unclaimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}</TYPE.body>
						</AutoColumn>
					)}
					<TYPE.subHeader style={{ textAlign: 'center' }}>
						{t('earn.liquidityRemainsPool')}
					</TYPE.subHeader>
					<ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
						{error ?? t('earn.claimReward', { symbol: stakingInfo?.rewardToken?.symbol })}
					</ButtonError>
				</ContentWrapper>
			)}
			{attempting && !hash && (
				<LoadingView onDismiss={wrappedOnDismiss}>
					<AutoColumn gap="12px" justify={'center'}>
						<TYPE.body fontSize={20}>
              {t('earn.claimingReward', {
                amount: stakingInfo?.earnedAmount?.toSignificant(6),
                symbol: stakingInfo?.rewardToken?.symbol
              })}
            </TYPE.body>
					</AutoColumn>
				</LoadingView>
			)}
			{hash && (
				<SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
					<AutoColumn gap="12px" justify={'center'}>
						<TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
						<TYPE.body fontSize={20}>{t('earn.claimedReward', { symbol: stakingInfo?.rewardToken?.symbol })}</TYPE.body>
					</AutoColumn>
				</SubmittedView>
			)}
		</Modal>
	)
}

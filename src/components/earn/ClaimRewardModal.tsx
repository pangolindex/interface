import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { DoubleSideStakingInfo, useMinichefPools } from '../../state/stake/hooks'
import { useStakingContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { TokenAmount } from '@pangolindex/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: DoubleSideStakingInfo
  version: number
  extraRewardTokensAmount?: Array<TokenAmount>
}

export default function ClaimRewardModal({
  isOpen,
  onDismiss,
  stakingInfo,
  version,
  extraRewardTokensAmount
}: StakingModalProps) {
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

  const poolMap = useMinichefPools()

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const isSuperFarm = extraRewardTokensAmount && extraRewardTokensAmount?.length > 0

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

  let errorMessage: string | undefined
  if (!account) {
    errorMessage = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    errorMessage = errorMessage ?? t('earn.enterAmount')
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
              <TYPE.body>{t('earn.unclaimedReward', { symbol: 'PNG' })}</TYPE.body>
            </AutoColumn>
          )}
          {isSuperFarm &&
            extraRewardTokensAmount?.map((rewardAmount, i) => (
              <AutoColumn justify="center" gap="md" key={i}>
                <TYPE.body fontWeight={600} fontSize={36}>
                  {rewardAmount?.toSignificant(6)}
                </TYPE.body>
                <TYPE.body>{t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}</TYPE.body>
              </AutoColumn>
            ))}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.liquidityRemainsPool')}</TYPE.subHeader>
          <ButtonError disabled={!!errorMessage} error={!!errorMessage && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
            {errorMessage ? errorMessage : isSuperFarm ? t('earn.claim') : t('earn.claimReward', { symbol: 'PNG' })}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.claimingReward', {
                amount: stakingInfo?.earnedAmount?.toSignificant(6),
                symbol: 'PNG'
              })}
            </TYPE.body>

            {isSuperFarm &&
              extraRewardTokensAmount?.map((rewardAmount, i) => (
                <TYPE.body fontSize={20} key={i}>
                  {t('earn.claimingReward', {
                    amount: rewardAmount?.toSignificant(6),
                    symbol: rewardAmount?.token?.symbol
                  })}
                </TYPE.body>
              ))}
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.claimedReward', { symbol: 'PNG' })}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}

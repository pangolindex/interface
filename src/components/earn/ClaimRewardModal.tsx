import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { DoubleSideStakingInfo, MiniChefStakingInfos, useMinichefPools } from '../../state/stake/hooks'
import { useMiniChefContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: DoubleSideStakingInfo
  miniChefStaking?: MiniChefStakingInfos
  pairAddress?: string
}

export default function ClaimRewardModal({
  isOpen,
  onDismiss,
  stakingInfo,
  miniChefStaking,
  pairAddress
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

  const minichefContract = useMiniChefContract()
  const poolMap = useMinichefPools()

  async function onClaimReward() {
    if (minichefContract && miniChefStaking?.stakedAmount && pairAddress) {
      setAttempting(true)
      await minichefContract
        .harvest(poolMap[pairAddress], account)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.claimAccumulated', { symbol: 'PNG' })
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
  if (!miniChefStaking?.stakedAmount) {
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
          {miniChefStaking?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {miniChefStaking?.earnedAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimedReward', { symbol: 'PNG' })}</TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.liquidityRemainsPool')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!miniChefStaking?.stakedAmount} onClick={onClaimReward}>
            {error ?? t('earn.claimReward', { symbol: 'PNG' })}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.claimingReward', {
                amount: miniChefStaking?.earnedAmount?.toSignificant(6),
                symbol: 'PNG'
              })}
            </TYPE.body>
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

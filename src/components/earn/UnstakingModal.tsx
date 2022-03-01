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
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { TokenAmount, ChainId } from '@antiyro/sdk'

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

export default function UnstakingModal({
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
  const { chainId } = useActiveWeb3React()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress[chainId || ChainId.AVALANCHE])
  const isSuperFarm = extraRewardTokensAmount && extraRewardTokensAmount?.length > 0

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
      await stakingContract[method](...args)
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
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.depositedPglLiquidity')}</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimedReward', { symbol: 'PNG' })}</TYPE.body>
            </AutoColumn>
          )}
          {isSuperFarm &&
            extraRewardTokensAmount?.map((rewardAmount, i) => (
              <AutoColumn justify="center" gap="md" key={i}>
                <TYPE.body fontWeight={600} fontSize={36}>
                  {<FormattedCurrencyAmount currencyAmount={rewardAmount} />}
                </TYPE.body>
                <TYPE.body>{t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}</TYPE.body>
              </AutoColumn>
            ))}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.whenYouWithdrawWarning')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? t('earn.withdrawAndClaim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.withdrawingLiquidity', {
                amount: stakingInfo?.stakedAmount?.toSignificant(4),
                symbol: 'PGL'
              })}
            </TYPE.body>
            <TYPE.body fontSize={20}>
              {t('earn.claimingReward', {
                amount: stakingInfo?.earnedAmount?.toSignificant(4),
                symbol: 'PNG'
              })}

              {isSuperFarm &&
                extraRewardTokensAmount?.map((rewardAmount, i) => (
                  <TYPE.body fontSize={20} key={i}>
                    {t('earn.claimingReward', {
                      amount: rewardAmount?.toSignificant(6),
                      symbol: rewardAmount?.token?.symbol
                    })}
                  </TYPE.body>
                ))}
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.withdrewStakingToken', { symbol: 'PGL' })}</TYPE.body>
            <TYPE.body fontSize={20}>{t('earn.claimedReward', { symbol: 'PNG' })}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}

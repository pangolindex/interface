import React, { useContext, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Card from '../../components/Card'
import { ButtonError } from '../../components/Button'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import {
  useAirdropIsClaimingAllowed,
  useClaimCallback,
  useUserHasAvailableClaim,
  useUserUnclaimedAmount
} from '../../state/airdrop/hooks'
import { useActiveWeb3React, useChainId, usePngSymbol } from '../../hooks'
import Confetti from '../../components/Confetti'
import { useTokenBalance } from '../../state/wallet/hooks'
import { UNI, SUSHI } from '../../constants/tokens'
import { ChainId, JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }

  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export default function Vote() {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const pngSymbol = usePngSymbol()
  const theme = useContext(ThemeContext)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(account)

  const claimingAllowed = useAirdropIsClaimingAllowed()
  const canClaim = useUserHasAvailableClaim(account)

  const claimAmount = useUserUnclaimedAmount(account)

  const uniAmount = useTokenBalance(account ? account : undefined, chainId ? UNI[chainId] : UNI[ChainId.AVALANCHE])
  const sushiAmount = useTokenBalance(
    account ? account : undefined,
    chainId ? SUSHI[chainId] : SUSHI[ChainId.AVALANCHE]
  )

  const hasUni = uniAmount?.greaterThan(JSBI.BigInt(1)) || uniAmount?.equalTo(JSBI.BigInt(1))
  const hasSushi = sushiAmount?.greaterThan(JSBI.BigInt(1)) || sushiAmount?.equalTo(JSBI.BigInt(1))

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  const [error, setError] = useState<any | undefined>()
  const { t } = useTranslation()

  // use the hash to monitor this txn

  function onClaim() {
    setAttempting(true)
    claimCallback()
      .then(_hash => {
        setAttempting(false)
        setHash(_hash)
      })
      // reset and log error
      .catch(err => {
        setAttempting(false)
        setError(err)
      })
  }

  const getCard = () => {
    if (!claimingAllowed) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.claimPeriodEnded')}
          </TYPE.body>
        </Card>
      )
    }
    if (!account) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.connectWalletViewLiquidity')}
          </TYPE.body>
        </Card>
      )
    }
    if (!canClaim) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('airdrop.noAvailableClaim', { pngSymbol: pngSymbol })}
          </TYPE.body>
        </Card>
      )
    }
    if (!hasUni && !hasSushi) {
      return (
        <Card padding="40px">
          <TYPE.body color={theme.text1} textAlign="center">
            {t('airdrop.noUniNoSushi')}
          </TYPE.body>
          <TYPE.body mt="1rem" color={theme.text1} textAlign="center">
            {t('airdrop.youHave') +
              claimAmount?.toFixed(0, { groupSeparator: ',' }) +
              t('airdrop.pngAvailableClaim', { symbol: pngSymbol })}
          </TYPE.body>
        </Card>
      )
    }
    if (attempting) {
      return (
        <EmptyProposals>
          <TYPE.body color={theme.text3} textAlign="center">
            <Dots>{t('airdrop.Loading')}</Dots>
          </TYPE.body>
        </EmptyProposals>
      )
    }
    if (claimConfirmed) {
      return (
        <TYPE.subHeader mt="1rem" fontWeight={500} color={theme.text1}>
          <span role="img" aria-label="party-hat">
            🎉{' '}
          </span>
          {t('airdrop.welcomeToTeamPangolin')}
          <span role="img" aria-label="party-hat">
            {' '}
            🎉
          </span>
        </TYPE.subHeader>
      )
    }

    return (
      <ButtonError error={!!error} padding="16px 16px" width="100%" mt="1rem" onClick={onClaim}>
        {error
          ? error['data']['message']
          : t('airdrop.claim') + claimAmount?.toFixed(0, { groupSeparator: ',' }) + ' PNG'}
      </ButtonError>
    )
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="2px">
        <Confetti start={Boolean(claimConfirmed)} />
        <TYPE.mediumHeader style={{ margin: '0.5rem 0' }} textAlign="center">
          {t('airdrop.claimPngAirdrop', { pngSymbol: pngSymbol })}
        </TYPE.mediumHeader>
        {getCard()}
      </TopSection>
    </PageWrapper>
  )
}

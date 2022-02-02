import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import GnosisSafeIcon from '../../assets/images/gnosis_safe.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { gnosisSafe, injected, walletlink, walletconnect } from '../../connectors'
import { NetworkContextName } from '../../constants'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import { useIsBetaUI } from '../../hooks/useLocation'

import Identicon from '../Identicon'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean; isBeta: boolean }>`
  background-color: ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary4)};
  border: none;
  color: ${({ theme, isBeta }) => (isBeta ? theme.white : theme.primaryText1)};
  font-weight: 500;
  padding: ${({ isBeta }) => (isBeta ? '0.35rem' : '0.5rem')};

  :hover,
  :focus,
  :active {
    border: 1px solid ${({ theme, isBeta }) => darken(0.05, isBeta ? theme.primary : theme.primary4)};
    color: ${({ theme, isBeta }) => (isBeta ? theme.white : theme.primaryText1)};
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary4)};
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }
  &:hover {
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary4)};
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }

  ${({ faded, isBeta }) =>
    faded &&
    css`
      background-color: ${({ theme }) => (isBeta ? theme.primary : theme.primary5)};
      border: 1px solid ${({ theme }) => (isBeta ? theme.primary : theme.primary5)};
      color: ${({ theme }) => (isBeta ? theme.white : theme.primaryText1)};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, isBeta ? theme.primary : theme.primary4)};
        color: ${({ theme }) => darken(0.05, isBeta ? theme.white : theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean; isBeta: boolean }>`
  background-color: ${({ pending, theme, isBeta }) =>
    pending && isBeta ? theme.primary : pending && !isBeta ? theme.primary1 : theme.bg2};
  border: 1px solid
    ${({ pending, theme, isBeta }) =>
      pending && isBeta ? theme.primary : pending && !isBeta ? theme.primary1 : theme.bg3};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme, isBeta }) =>
      pending && isBeta
        ? darken(0.05, theme.primary)
        : pending && !isBeta
        ? darken(0.05, theme.primary1)
        : lighten(0.05, theme.bg2)};

    :focus {
      border: 1px solid
        ${({ pending, theme, isBeta }) =>
          pending && isBeta
            ? darken(0.1, theme.primary)
            : pending && !isBeta
            ? darken(0.1, theme.primary1)
            : darken(0.1, theme.bg3)};
    }
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary4)};
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }

  &:hover {
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary4)};
    border: 1px solid ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary3)};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === gnosisSafe) {
    return (
      <IconWrapper size={16}>
        <img src={GnosisSafeIcon} alt={'GnosisSafeIcon'} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={'CoinbaseWallet'} />
      </IconWrapper>
    )
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={'WalletConnect'} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, connector, error } = useWeb3React()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()

  const isBeta = useIsBetaUI()

  if (account) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
        isBeta={isBeta}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>
              {pending?.length} {t('web3Status.pending')}
            </Text>{' '}
            <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            <Text>{shortenAddress(account)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? t('web3Status.wrongNetwork') : t('web3Status.error')}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account} isBeta={isBeta}>
        <Text>{t('web3Status.connectToWallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}

import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  Box,
  WalletModal as NewWalletModal,
  gnosisSafe,
  injected,
  walletconnect,
  walletlink,
  xDefi,
  NetworkContextName
} from '@pangolindex/components'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo, useContext, useCallback } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css, ThemeContext } from 'styled-components'
import CoinbaseWalletIcon from 'src/assets/images/coinbaseWalletIcon.svg'
import GnosisSafeIcon from 'src/assets/images/gnosis_safe.png'
import WalletConnectIcon from 'src/assets/images/walletConnectIcon.svg'
import XDefiIcon from 'src/assets/images/xDefi.png'
import { useModalOpen, useWalletModalToggle, useAccountDetailToggle } from 'src/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'src/state/transactions/hooks'
import { TransactionDetails } from 'src/state/transactions/reducer'
import { shortenAddress } from 'src/utils'
import { ButtonSecondary } from '../Button'
import { useIsBetaUI } from 'src/hooks/useLocation'
import Identicon from '../Identicon'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import { ApplicationModal } from 'src/state/application/actions'
import AccountDetailsModal from '../AccountDetailsModal'

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

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;
  padding: 0.5rem;

  :hover,
  :focus,
  :active {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnectBeta = styled(Box)<{ faded?: boolean }>`
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  padding: 0.35rem;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg2)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2))};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3))};
    }
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
`

const Web3StatusConnectedBeta = styled(Box)<{ pending?: boolean }>`
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  display: flex;
  font-size: 16px;
  padding: 0.35rem;
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary : theme.bg3)};
  background-color: ${({ pending, theme }) => (pending ? theme.primary : theme.color2)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :focus {
    outline: none;
  }

  ${({ theme, pending }) => theme.mediaWidth.upToSmall`
    padding: 10px;
    border: none;
    background-color: ${pending ? theme.primary : theme.color7};
  `};
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
  } else if (connector === xDefi) {
    return (
      <IconWrapper size={16}>
        <img src={XDefiIcon} alt={'XDEFIWalletConnect'} />
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
  const toggleAccountDetailModal = useAccountDetailToggle()

  const isBeta = useIsBetaUI()
  //ATTENTION ICI
  const StatusConnected: any = isBeta ? Web3StatusConnectedBeta : Web3StatusConnected
  const StatusConnect: any = isBeta ? Web3StatusConnectBeta : Web3StatusConnect
  if (account) {
    return (
      <StatusConnected
        id="web3-status-connected"
        onClick={() => {
          if (isBeta) {
            toggleAccountDetailModal()
          } else {
            toggleWalletModal()
          }
        }}
        pending={hasPendingTransactions}
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
      </StatusConnected>
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
      <StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>{t('web3Status.connectToWallet')}</Text>
      </StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { account, active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const isBeta = useIsBetaUI()

  const theme = useContext(ThemeContext)

  const allTransactions = useAllTransactions()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const accountDetailModalOpen = useModalOpen(ApplicationModal.ACCOUNT_DETAIL)
  const toggleAccountDetailModal = useAccountDetailToggle()

  const onWalletChange = useCallback(() => {
    toggleAccountDetailModal()
    toggleWalletModal()
  }, [toggleAccountDetailModal, toggleWalletModal])

  const onClickBack = useCallback(() => {
    toggleWalletModal()
    toggleAccountDetailModal()
  }, [toggleAccountDetailModal, toggleWalletModal])

  const onWalletConnect = useCallback(() => {
    toggleWalletModal()
  }, [toggleWalletModal])

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }
  const renderModal = () => {
    if (!isBeta) {
      return <WalletModal ENSName={undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    } else if (!account || walletModalOpen) {
      return (
        <NewWalletModal
          open={walletModalOpen}
          closeModal={toggleWalletModal}
          background={theme.bg2}
          shouldShowBackButton={account ? true : false}
          onWalletConnect={onWalletConnect}
          onClickBack={onClickBack}
        />
      )
    } else if (account) {
      return (
        <AccountDetailsModal
          ENSName={undefined}
          pendingTransactions={pending}
          confirmedTransactions={confirmed}
          onWalletChange={onWalletChange}
          open={accountDetailModalOpen}
          closeModal={toggleAccountDetailModal}
        />
      )
    }
    return null
  }

  return (
    <>
      <Web3StatusInner />
      {renderModal()}
    </>
  )
}

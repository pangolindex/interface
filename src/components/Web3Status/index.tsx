import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  useWalletModalToggle,
  useAllTransactions as useAllTransactionsComponents
} from '@honeycomb-finance/state-hooks'
import { Box } from '@honeycomb-finance/core'
import {
  injected,
  gnosisSafe,
  walletlink,
  xDefi,
  avalancheCore,
  near,
  HashConnector,
  WalletConnectConnector
} from '@honeycomb-finance/wallet-connectors'
import { useActiveWeb3React, useTranslation, shortenAddressMapping } from '@honeycomb-finance/shared'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken } from 'polished'
import React, { useMemo, useCallback } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import CoinbaseWalletIcon from 'src/assets/svg/coinbaseWalletIcon.svg'
import GnosisSafeIcon from 'src/assets/images/gnosis_safe.png'
import WalletConnectIcon from 'src/assets/svg/walletConnectIcon.svg'
import XDefiIcon from 'src/assets/images/xDefi.png'
import NearIcon from 'src/assets/svg/near.svg'
import avalancheCoreIcon from 'src/assets/svg/avalancheCore.svg'
import HashIcon from 'src/assets/images/hashConnect.png'
import { useModalOpen, useAccountDetailToggle } from 'src/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'src/state/transactions/hooks'
import { TransactionDetails } from 'src/state/transactions/reducer'
import { ButtonSecondary } from '../Button'
import Identicon from '../Identicon'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import { ApplicationModal } from 'src/state/application/actions'
import AccountDetailsModal from '../AccountDetailsModal'
import { useChainId } from 'src/hooks'

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

const Web3StatusConnect = styled(Box)<{ faded?: boolean }>`
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  padding: 8px 12px;
  :focus {
    outline: none;
  }
`

const Web3StatusConnected = styled(Box)<{ pending?: boolean }>`
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  display: flex;
  font-size: 16px;
  padding: 8px 12px;
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
  } else if (connector instanceof WalletConnectConnector) {
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
  } else if (connector === near) {
    return (
      <IconWrapper size={16}>
        <img src={NearIcon} alt={'Near Wallet'} />
      </IconWrapper>
    )
  } else if (connector === avalancheCore) {
    return (
      <IconWrapper size={16}>
        <img src={avalancheCoreIcon} alt={'Avalanche Core Wallet'} />
      </IconWrapper>
    )
  } else if (connector instanceof HashConnector) {
    return (
      <IconWrapper size={16}>
        <img src={HashIcon} alt={'HashPack Wallet'} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, connector, error } = useWeb3React()

  const chainId = useChainId()

  const allTransactions = useAllTransactions()
  const shortenAddress = shortenAddressMapping[chainId]

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const toggleAccountDetailModal = useAccountDetailToggle()

  //ATTENTION ICI
  const StatusConnected: any = Web3StatusConnected
  const StatusConnect: any = Web3StatusConnect
  if (account) {
    return (
      <StatusConnected
        id="web3-status-connected"
        onClick={() => {
          toggleAccountDetailModal()
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
            <Text>{shortenAddress(account, chainId)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError variant="plain" onClick={toggleWalletModal}>
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
  const { account } = useActiveWeb3React()

  const allTransactionsInterface = useAllTransactions()
  const allTransactionsComponents = useAllTransactionsComponents()

  const allTransactions: { [txHash: string]: TransactionDetails } = useMemo(() => {
    return { ...allTransactionsInterface, ...allTransactionsComponents }
  }, [allTransactionsInterface, allTransactionsComponents])

  const toggleWalletModal = useWalletModalToggle()

  const accountDetailModalOpen = useModalOpen(ApplicationModal.ACCOUNT_DETAIL)
  const toggleAccountDetailModal = useAccountDetailToggle()

  const onWalletChange = useCallback(() => {
    toggleAccountDetailModal()
    toggleWalletModal()
  }, [toggleAccountDetailModal, toggleWalletModal])

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const renderModal = () => {
    if (account) {
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

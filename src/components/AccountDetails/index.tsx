import React, { useCallback, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import { useDispatch } from 'src/state'
import { clearAllTransactions } from 'src/state/transactions/actions'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import CoinbaseWalletIcon from 'src/assets/svg/coinbaseWalletIcon.svg'
import WalletConnectIcon from 'src/assets/svg/walletConnectIcon.svg'
import GnosisSafeIcon from 'src/assets/images/gnosis_safe.png'
import NearIcon from 'src/assets/svg/near.svg'
import avalancheCoreIcon from 'src/assets/svg/avalancheCore.svg'
import BitKeep from 'src/assets/svg/bitkeep.svg'
import HashIcon from 'src/assets/images/hashConnect.png'
import {
  gnosisSafe,
  injected,
  walletconnect,
  walletlink,
  near,
  avalancheCore,
  SUPPORTED_WALLETS,
  shortenAddress,
  NearConnector,
  useAllTransactionsClearer,
  useTranslation,
  getEtherscanLink,
  bitKeep,
  hashConnect,
  HashConnector
} from '@pangolindex/components'
import Identicon from '../Identicon'
import { ExternalLink as LinkIcon } from 'react-feather'
import { LinkStyledButton, TYPE } from 'src/theme'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {
  AccountControl,
  AccountGroupingRow,
  AccountSection,
  AddressLink,
  CloseColor,
  CloseIcon,
  HeaderRow,
  IconWrapper,
  InfoCard,
  LowerSection,
  TransactionListWrapper,
  UpperSection,
  WalletAction,
  WalletName,
  YourAccount
} from './styled'
import Scrollbars from 'react-custom-scrollbars'

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions
}: AccountDetailsProps) {
  const { account, connector } = useActiveWeb3React()
  const chainId = useChainId()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const clearAllTxComponents = useAllTransactionsClearer()

  function formatConnectorName() {
    const { ethereum, avalanche } = window

    const isTalisman = !!(ethereum && ethereum.isTalisman)
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const isXDEFI = !!(ethereum && ethereum.isXDEFI)
    const isRabby = !!(ethereum && ethereum.isRabby)
    const isCoinbase = !!(ethereum && ethereum.isCoinbaseWallet)
    const isAvalancheCore = !!(avalanche && avalanche.isAvalanche)

    let name = Object.keys(SUPPORTED_WALLETS)
      .filter(k => SUPPORTED_WALLETS[k].connector === connector)
      .map(k => SUPPORTED_WALLETS[k].name)[0]

    // If injected connector, try to guess which one it is
    if (name === 'Injected') {
      if (isXDEFI) name = SUPPORTED_WALLETS.XDEFI.name
      else if (isTalisman) name = SUPPORTED_WALLETS.TALISMAN.name
      else if (isRabby) name = SUPPORTED_WALLETS.RABBY.name
      else if (isCoinbase) name = SUPPORTED_WALLETS.WALLET_LINK.name
      // metamask as last check, because most of the wallets above are likely to set isMetaMask to true too
      else if (isMetaMask) name = SUPPORTED_WALLETS.METAMASK.name
      else if (isAvalancheCore) name = SUPPORTED_WALLETS.AVALANCHECORE.name
    }

    return <WalletName>{t('accountDetails.connectedWith') + name}</WalletName>
  }

  //TODO CHECK TESTING
  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'Coinbase Wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'Wallet Connect logo'} />
        </IconWrapper>
      )
    } else if (connector === gnosisSafe) {
      return (
        <IconWrapper size={16}>
          <img src={GnosisSafeIcon} alt={'Gnosis Safe logo'} />
        </IconWrapper>
      )
    } else if (connector === bitKeep) {
      return (
        <IconWrapper size={16}>
          <img src={BitKeep} alt={'BitKeep logo'} />
        </IconWrapper>
      )
    } else if (connector === near) {
      return (
        <IconWrapper size={16}>
          <img src={NearIcon} alt={'Near Wallet'} />
        </IconWrapper>
      )
    } else if (connector === hashConnect) {
      return (
        <IconWrapper size={16}>
          <img src={HashIcon} alt={'HashPack Wallet'} />
        </IconWrapper>
      )
    } else if (connector === avalancheCore) {
      return (
        <IconWrapper size={16}>
          <img src={avalancheCoreIcon} alt={'Avalanche Core Wallet'} />
        </IconWrapper>
      )
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) {
      dispatch(clearAllTransactions({ chainId }))
      clearAllTxComponents()
    }
  }, [dispatch, chainId, clearAllTxComponents])

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>{t('accountDetails.account')}</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div>
                  {/* TODO : CHECK on disccount  */}
                  {(connector instanceof WalletLinkConnector ||
                    connector instanceof WalletConnectConnector ||
                    connector instanceof NearConnector ||
                    connector instanceof HashConnector) && (
                    <WalletAction
                      style={{ fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                      onClick={() => {
                        connector.close()
                        if (connector instanceof NearConnector) {
                          window.location.reload()
                        }
                      }}
                    >
                      {t('accountDetails.disconnect')}
                    </WalletAction>
                  )}

                  <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 400 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    {t('accountDetails.change')}
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {account && shortenAddress(account, chainId)}</p>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>{t('accountDetails.copy')}</span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={chainId && getEtherscanLink(chainId, ENSName, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>{t('accountDetails.viewExplorer')}</span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>{t('accountDetails.copy')}</span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getEtherscanLink(chainId, account, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>{t('accountDetails.viewExplorer')}</span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <TYPE.body>{t('accountDetails.recentTransactions')}</TYPE.body>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>{t('accountDetails.clearAll')}</LinkStyledButton>
          </AutoRow>
          <Scrollbars autoHeight={true} autoHeightMin={20} autoHeightMax={200}>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </Scrollbars>
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme.text1}>{t('accountDetails.transactionAppear')}</TYPE.body>
        </LowerSection>
      )}
    </>
  )
}

import React, { useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React, useChainId } from '../../hooks'
import { useDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import CoinbaseWalletIcon from '../../assets/svg/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/svg/walletConnectIcon.svg'
import GnosisSafeIcon from '../../assets/images/gnosis_safe.png'
import { ReactComponent as Close } from '../../assets/svg/x.svg'
import NearIcon from '../../assets/svg/near.svg'
import HashIcon from 'src/assets/images/hashConnect.png'
import {
  gnosisSafe,
  injected,
  walletconnect,
  walletlink,
  near,
  SUPPORTED_WALLETS,
  shortenAddress,
  NearConnector,
  useAllTransactionsClearer,
  useTranslation,
  getEtherscanLink,
  hashConnect,
  HashConnector
} from '@pangolindex/components'
import Identicon from '../Identicon'
import { ButtonSecondary } from '../Button'
import { ExternalLink as LinkIcon } from 'react-feather'
import { ExternalLink, LinkStyledButton, TYPE } from '../../theme'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonSecondary)`
  color: ${({ theme }) => theme.primary};
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primary};
  }
`

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
    const { ethereum } = window
    const isTalisman = !!(ethereum && ethereum.isTalisman)
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const isXDEFI = !!(ethereum && ethereum.isXDEFI)
    const isRabby = !!(ethereum && ethereum.isRabby)
    const isCoinbase = !!(ethereum && ethereum.isCoinbaseWallet)

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
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme.text1}>{t('accountDetails.transactionAppear')}</TYPE.body>
        </LowerSection>
      )}
    </>
  )
}

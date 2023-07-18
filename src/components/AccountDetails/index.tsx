import React, { useCallback, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useChainId } from 'src/hooks'
import { useDispatch } from 'src/state'
import { clearAllTransactions } from 'src/state/transactions/actions'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import {
  NearConnector,
  useAllTransactionsClearer,
  useTranslation,
  getEtherscanLink,
  shortenAddressMapping,
  PangolinInjectedWallet,
  injected,
  useActiveWeb3React
} from '@pangolindex/components'
import Identicon from '../Identicon'
import { ExternalLink as LinkIcon } from 'react-feather'
import { LinkStyledButton, TYPE } from 'src/theme'
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
import { supportedWallets } from 'src/constants'

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
  const { account, connector, deactivate } = useActiveWeb3React()
  const chainId = useChainId()

  const shortenAddress = shortenAddressMapping[chainId]
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const clearAllTxComponents = useAllTransactionsClearer()

  const wallet = Object.values(supportedWallets).find(_wallet => _wallet.isActive)

  function getStatusIcon() {
    if (wallet instanceof PangolinInjectedWallet || wallet?.connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    }

    return (
      <IconWrapper size={16}>
        <img src={wallet?.icon} alt={wallet?.name + ' Logo'} />
      </IconWrapper>
    )
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
                <WalletName>{t('accountDetails.connectedWith') + wallet?.name}</WalletName>
                <div>
                  <WalletAction
                    variant="plain"
                    onClick={() => {
                      wallet?.disconnect()
                      deactivate()
                      if (connector instanceof NearConnector) {
                        window.location.reload()
                      }
                    }}
                  >
                    {t('accountDetails.disconnect')}
                  </WalletAction>

                  <WalletAction
                    variant="plain"
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

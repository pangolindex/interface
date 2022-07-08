import { AbstractConnector } from '@web3-react/abstract-connector'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import MetamaskIcon from '../../assets/images/metamask.png'
import XDefiIcon from '../../assets/images/xDefi.png'
import RabbyIcon from '../../assets/images/rabby.svg'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import {
  gnosisSafe,
  injected,
  xDefi,
  SUPPORTED_WALLETS,
  LANDING_PAGE,
  AVALANCHE_CHAIN_PARAMS,
  IS_IN_IFRAME,
  WalletInfo
} from '@pangolindex/components'
import usePrevious from '../../hooks/usePrevious'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import AccountDetails from '../AccountDetails'
import { ButtonLight } from '../../components/Button'

import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import { useTranslation } from 'react-i18next'

const WALLET_TUTORIAL = `${LANDING_PAGE}/tutorials/getting-started/#set-up-metamask`

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

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
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

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

function addAvalancheNetwork() {
  injected.getProvider().then(provider => {
    provider
      ?.request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_CHAIN_PARAMS]
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error: web3Error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [selectedOption, setSelectedOption] = useState<WalletInfo | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const [triedSafe, setTriedSafe] = useState<boolean>(!IS_IN_IFRAME)

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)
  const { t } = useTranslation()

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) || (connector && connector !== connectorPrevious && !web3Error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, web3Error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const isMetamask = window.ethereum && window.ethereum.isMetaMask
  const isRabby = window.ethereum && window.ethereum.isRabby
  const isCbWalletDappBrowser = window?.ethereum?.isCoinbaseWallet
  const isWalletlink = !!window?.WalletLinkProvider || !!window?.walletLinkExtension
  const isCbWallet = isCbWalletDappBrowser || isWalletlink

  const tryActivation = async (
    activationConnector: AbstractConnector | SafeAppConnector | undefined,
    option: WalletInfo | undefined
  ) => {
    const name = Object.keys(SUPPORTED_WALLETS).find(key => SUPPORTED_WALLETS[key].connector === activationConnector)
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setSelectedOption(option)
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (activationConnector instanceof WalletConnectConnector && activationConnector.walletConnectProvider?.wc?.uri) {
      activationConnector.walletConnectProvider = undefined
    }

    if (!triedSafe && activationConnector instanceof SafeAppConnector) {
      activationConnector.isSafeApp().then(loadedInSafe => {
        if (loadedInSafe) {
          activate(activationConnector, undefined, true).catch(() => {
            setTriedSafe(true)
          })
        }
        setTriedSafe(true)
      })
    } else if (activationConnector) {
      activate(activationConnector, undefined, true)
        .then(() => {
          if (isCbWallet) {
            addAvalancheNetwork()
          }
        })
        .catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(activationConnector) // a little janky...can't use setError because the connector isn't set
          } else {
            setPendingError(true)
          }
        })
    }
  }

  function getActiveOption(): WalletInfo | undefined {
    if (connector === injected) {
      if (isRabby) {
        return SUPPORTED_WALLETS.RABBY
      } else if (isMetamask) {
        return SUPPORTED_WALLETS.METAMASK
      }
      return SUPPORTED_WALLETS.INJECTED
    }
    const name = Object.keys(SUPPORTED_WALLETS).find(key => SUPPORTED_WALLETS[key].connector === connector)
    if (name) {
      return SUPPORTED_WALLETS[name]
    }
    return undefined
  }

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isXDEFI = window.ethereum && window.ethereum.isXDEFI
    const activeOption = getActiveOption()

    return Object.keys(SUPPORTED_WALLETS)
      .filter(key => SUPPORTED_WALLETS[key].isEVM)
      .map(key => {
        const option = SUPPORTED_WALLETS[key]
        // check for mobile options
        if (isMobile) {
          if (!window.web3 && !window.ethereum && option.mobile) {
            return (
              <Option
                onClick={() => {
                  option.connector !== connector && !option.href && tryActivation(option.connector, option)
                }}
                id={`connect-${key}`}
                key={key}
                active={activeOption && option.name === activeOption.name}
                color={option.color}
                link={option.href}
                header={option.name}
                subheader={null}
                icon={option.iconName}
              />
            )
          }
          return null
        }

        // overwrite injected when needed
        if (option.connector === injected) {
          if (option.name === 'Rabby Wallet') {
            if (!isRabby) {
              return (
                <Option
                  id={`connect-${key}`}
                  key={key}
                  color={'#7a7cff'}
                  header={'Install Rabby Wallet'}
                  subheader={null}
                  link={'https://rabby.io/'}
                  icon={RabbyIcon}
                />
              )
            }
          }

          // don't show injected if there's no injected provider
          if (!(window.web3 || window.ethereum)) {
            if (option.name === 'MetaMask') {
              return (
                <Option
                  id={`connect-${key}`}
                  key={key}
                  color={'#E8831D'}
                  header={'Install Metamask'}
                  subheader={null}
                  link={'https://metamask.io/'}
                  icon={MetamaskIcon}
                />
              )
            } else {
              return null //dont want to return install twice
            }
          }
          // don't return metamask if injected provider isn't metamask
          else if (option.name === 'MetaMask' && !isMetamask) {
            return null
          }

          // likewise for generic
          else if (option.name === 'Injected' && isMetamask) {
            return null
          }
        }

        // overwrite injected when needed
        else if (option.connector === xDefi) {
          // don't show injected if there's no injected provider

          if (!(window.xfi && window.xfi.ethereum && window.xfi.ethereum.isXDEFI)) {
            if (option.name === 'XDEFI Wallet') {
              return (
                <Option
                  id={`connect-${key}`}
                  key={key}
                  color={'#315CF5'}
                  header={'Install XDEFI Wallet'}
                  subheader={null}
                  link={'https://www.xdefi.io/'}
                  icon={XDefiIcon}
                />
              )
            } else {
              return null //dont want to return install twice
            }
          }

          // likewise for generic
          else if (option.name === 'Injected' && (isMetamask || isXDEFI)) {
            return null
          }
        }

        // Not show Gnosis Safe option without Gnosis Interface
        if (option.connector === gnosisSafe && !IS_IN_IFRAME) {
          return null
        }

        // return rest of options
        return (
          !isMobile &&
          !option.mobileOnly && (
            <Option
              id={`connect-${key}`}
              onClick={() => {
                option.connector === connector
                  ? setWalletView(WALLET_VIEWS.ACCOUNT)
                  : !option.href && tryActivation(option.connector, option)
              }}
              key={key}
              active={activeOption && option.name === activeOption.name}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null} //use option.descriptio to bring back multi-line
              icon={option.iconName}
            />
          )
        )
      })
  }

  function getModalContent() {
    const isXDEFI = window.xfi && window.xfi.ethereum && window.xfi.ethereum.isXDEFI
    const isMetamaskOrCbWallet = isMetamask || isCbWallet || isXDEFI

    if (web3Error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {web3Error instanceof UnsupportedChainIdError
              ? t('walletModal.wrongNetwork')
              : t('walletModal.errorConnecting')}
          </HeaderRow>
          <ContentWrapper>
            {web3Error instanceof UnsupportedChainIdError ? (
              <>
                <h5>{t('walletModal.pleaseConnectAvalanche')}</h5>
                {isMetamaskOrCbWallet && (
                  <ButtonLight onClick={addAvalancheNetwork}>{t('walletModal.switchAvalanche')}</ButtonLight>
                )}
              </>
            ) : (
              t('walletModal.errorConnectingRefresh')
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>{t('walletModal.connectToWallet')}</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              option={selectedOption}
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <span>{t('walletModal.newToAvalanche')} &nbsp;</span>{' '}
              <ExternalLink href={WALLET_TUTORIAL}>{t('walletModal.learnMoreWallet')}</ExternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}

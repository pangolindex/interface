import { TokenInfoModal } from '@honeycomb-finance/portfolio'
import { Tokens, useActiveWeb3React, useOnClickOutside } from '@honeycomb-finance/shared'
import {
  ApplicationModal as ApplicationModalComponents,
  useAccountBalanceHook,
  useApplicationState,
  useModalOpen as useModalOpenComponents,
  useWalletModalToggleWithChainId
} from '@honeycomb-finance/state-hooks'
import { NetworkSelection, WalletModal } from '@honeycomb-finance/walletmodal'
import { CHAINS, Chain } from '@pangolindex/sdk'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useMedia } from 'react-use'
import { ReactComponent as DiscordIcon } from 'src/assets/svg/discord.svg'
import { ButtonPrimary } from 'src/components/Button'
import SwitchSubgraph from 'src/components/SwitchSubgraph'
import { DISCORD_SUPPORT, NETWORK_CURRENCY, NETWORK_LABELS, supportedWallets } from 'src/constants'
import { useChainId } from 'src/hooks'
import { useWallet } from 'src/state/user/hooks'
import { Hidden, MEDIA_WIDTHS } from 'src/theme'
import styled, { keyframes } from 'styled-components'
import LightMode from '../../assets/svg/lightMode.svg'
import NightMode from '../../assets/svg/nightMode.svg'
import Web3Status from '../../components/Web3Status'
import { usePNGCirculationSupply } from '../../hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { MobileHeader } from './MobileHeader'
import {
  AccountElement,
  BalanceText,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  HeaderFrame,
  LegacyButtonWrapper,
  Logo,
  NetworkCard,
  PNGAmount,
  PNGWrapper,
  SupportButton,
  ThemeMode
} from './styled'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

// pulse animation keyframes with styled-components
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(230, 180, 0, 0.8)
  }
  50% {
    box-shadow: 0 0 0 4px rgba(230, 180, 0, 0.8)
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 180, 0, 0.8)
  }
`

const SuperFarmButton = styled(ButtonPrimary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  white-space: nowrap;
  height: 40px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  transition: all 0.3s ease-in-out;
  animation: ${pulse} 2s infinite;

  :hover {
    color: ${({ theme }) => theme.text6};
    // box-shadow: 0 0 0 10px rgba(230, 180, 0, 0.3);
  }

  :focus {
    border: 1px solid blue;
  }
`

export default function Header({ activeMobileMenu, handleMobileMenu }: Props) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { PNG } = Tokens
  const useETHBalances = useAccountBalanceHook[chainId]

  const accounts = useMemo(() => (account ? [account] : []), [account])

  const userEthBalance = useETHBalances(chainId, accounts)?.[account ?? '']

  const [showPngBalanceModal, setShowPngBalanceModal] = useState(false)
  const [openNetworkSelection, setOpenNetworkSelection] = useState(false)

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FARM)
  const toggle = useToggleModal(ApplicationModal.FARM)

  const walletModalOpen = useModalOpenComponents(ApplicationModalComponents.WALLET)
  const toggleWalletModal = useWalletModalToggleWithChainId()
  const { walletModalChainId } = useApplicationState()
  const [, setWallet] = useWallet()

  useOnClickOutside(node, open ? toggle : undefined)

  const [isDark, toggleDarkMode] = useDarkModeManager()

  const closeNetworkSelection = () => {
    setOpenNetworkSelection(false)
  }

  function closePngBalanceModal() {
    setShowPngBalanceModal(false)
  }

  const isMobile = useMedia(`(max-width: ${MEDIA_WIDTHS.upToMedium}px)`)

  const png = PNG[chainId]

  const { data: pngCirculationSupply } = usePNGCirculationSupply()

  const handleSelectChain = useCallback(
    (chain: Chain) => {
      setOpenNetworkSelection(false)
      toggleWalletModal(chain.chain_id)
    },
    [setOpenNetworkSelection, toggleWalletModal]
  )

  const closeWalletModal = useCallback(() => {
    toggleWalletModal(undefined)
  }, [toggleWalletModal])

  const onWalletConnect = useCallback(
    connectorKey => {
      toggleWalletModal(undefined)
      setWallet(connectorKey)
    },
    [setWallet, toggleWalletModal]
  )

  return (
    <HeaderFrame>
      {isMobile ? (
        <MobileHeader activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
      ) : (
        <HeaderControls>
          <HeaderElement>
            <SuperFarmButton
              variant="primary"
              onClick={() => {
                window.open('https://beta.pangolin.exchange/#/superfarms', '_blank')
              }}
            >
              SuperFarms ⭐
            </SuperFarmButton>
            <LegacyButtonWrapper>
              <SwitchSubgraph />
              <SupportButton href={DISCORD_SUPPORT} target="_blank">
                <DiscordIcon style={{ width: '18px', fill: isDark ? '#fff' : undefined }} />
                <span style={{ whiteSpace: 'nowrap', marginLeft: '5px' }}>Support</span>
              </SupportButton>
            </LegacyButtonWrapper>
            <Hidden upToSmall={true}>
              <NetworkSelection
                open={openNetworkSelection}
                closeModal={closeNetworkSelection}
                onToogleWalletModal={handleSelectChain}
              />
              {chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard
                  title={NETWORK_LABELS[chainId]}
                  onClick={() => setOpenNetworkSelection(!openNetworkSelection)}
                >
                  <Logo src={CHAINS[chainId].logo} />
                  {NETWORK_LABELS[chainId]}
                </NetworkCard>
              )}
            </Hidden>
            {CHAINS[chainId].png_symbol && (
              <PNGWrapper onClick={() => setShowPngBalanceModal(true)}>
                <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                  {CHAINS[chainId].png_symbol}
                </PNGAmount>
              </PNGWrapper>
            )}
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} {NETWORK_CURRENCY[chainId]}
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            <ThemeMode onClick={() => toggleDarkMode()}>
              {isDark ? (
                <img width={'16px'} src={LightMode} alt={'Setting'} />
              ) : (
                <img width={'16px'} src={NightMode} alt={'NightMode'} />
              )}
            </ThemeMode>
          </HeaderElementWrap>
        </HeaderControls>
      )}
      <TokenInfoModal
        open={showPngBalanceModal}
        circulationSupply={pngCirculationSupply}
        closeModal={closePngBalanceModal}
        token={png}
      />

      <WalletModal
        open={walletModalOpen}
        closeModal={closeWalletModal}
        onWalletConnect={onWalletConnect}
        initialChainId={walletModalChainId}
        supportedWallets={supportedWallets}
      />
    </HeaderFrame>
  )
}

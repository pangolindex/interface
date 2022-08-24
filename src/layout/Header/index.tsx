import { NetworkSelection, useAccountBalanceHook } from '@pangolindex/components'
import React, { useState, useRef, useMemo } from 'react'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import Web3Status from 'src/components/Web3Status'
import Modal from 'src/components/Modal'
import PngBalanceContent from './PngBalanceContent'
import LanguageSelection from 'src/components/LanguageSelection'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { useDarkModeManager } from 'src/state/user/hooks'
import NightMode from 'src/assets/svg/nightMode.svg'
import LightMode from 'src/assets/svg/lightMode.svg'
import {
  HeaderFrame,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  AccountElement,
  NetworkCard,
  BalanceText,
  ThemeMode
} from './styled'
import { Hidden, MEDIA_WIDTHS } from 'src/theme'
import { NETWORK_CURRENCY, NETWORK_LABELS } from 'src/constants'
import { useMedia } from 'react-use'
import { MobileHeader } from './MobileHeader'
import { DesktopHamburger } from './DesktopHamburger'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
  activeDesktopMenu: boolean
  handleDesktopMenu: () => void
}

export default function Header({ activeMobileMenu, handleMobileMenu, activeDesktopMenu, handleDesktopMenu }: Props) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const useETHBalances = useAccountBalanceHook[chainId]

  const accounts = useMemo(() => (account ? [account] : []), [account])

  const userEthBalance = useETHBalances(chainId, accounts)?.[account ?? '']

  const [showPngBalanceModal, setShowPngBalanceModal] = useState(false)
  const [openNetworkSelection, setOpenNetworkSelection] = useState(false)

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FARM)
  const toggle = useToggleModal(ApplicationModal.FARM)
  useOnClickOutside(node, open ? toggle : undefined)

  const [isDark, toggleDarkMode] = useDarkModeManager()

  const closeNetworkSelection = () => {
    setOpenNetworkSelection(false)
  }

  const isMobile = useMedia(`(max-width: ${MEDIA_WIDTHS.upToMedium}px)`)

  return (
    <HeaderFrame>
      <Modal isOpen={showPngBalanceModal} onDismiss={() => setShowPngBalanceModal(false)}>
        {showPngBalanceModal && <PngBalanceContent setShowPngBalanceModal={setShowPngBalanceModal} />}
      </Modal>
      {isMobile ? (
        <MobileHeader activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
      ) : (
        <HeaderControls>
          <HeaderElement>
            <Hidden upToSmall={true}>
              <NetworkSelection open={openNetworkSelection} closeModal={closeNetworkSelection} />
              {chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard
                  title={NETWORK_LABELS[chainId]}
                  onClick={() => setOpenNetworkSelection(!openNetworkSelection)}
                >
                  {NETWORK_LABELS[chainId]}
                </NetworkCard>
              )}
            </Hidden>
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
            <LanguageSelection />
            <ThemeMode onClick={() => toggleDarkMode()}>
              {isDark ? (
                <img width={'16px'} src={LightMode} alt={'Setting'} />
              ) : (
                <img width={'16px'} src={NightMode} alt={'NightMode'} />
              )}
            </ThemeMode>
            <DesktopHamburger activeDesktopMenu={activeDesktopMenu} handleDesktopMenu={handleDesktopMenu} />
          </HeaderElementWrap>
        </HeaderControls>
      )}
    </HeaderFrame>
  )
}

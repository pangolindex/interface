import { Button, NetworkSelection, useAccountBalanceHook, useTranslation } from '@pangolindex/components'
import React, { useState, useRef, useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import Web3Status from '../../components/Web3Status'
import Modal from '../../components/Modal'
import PngBalanceContent from './PngBalanceContent'
import LanguageSelection from '../../components/LanguageSelection'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useDarkModeManager } from '../../state/user/hooks'
import NightMode from '../../assets/svg/nightMode.svg'
import LightMode from '../../assets/svg/lightMode.svg'
import {
  HeaderFrame,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  AccountElement,
  PNGAmount,
  PNGWrapper,
  NetworkCard,
  BalanceText,
  ThemeMode,
  LegacyButtonWrapper
} from './styled'
import { Hidden, MEDIA_WIDTHS } from 'src/theme'
import { useChainId } from 'src/hooks'
import { LEGACY_PAGE, NETWORK_CURRENCY, NETWORK_LABELS } from 'src/constants'
import { useMedia } from 'react-use'
import { MobileHeader } from './MobileHeader'
import { CHAINS } from '@pangolindex/sdk'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

export default function Header({ activeMobileMenu, handleMobileMenu }: Props) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { t } = useTranslation()

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
            <LegacyButtonWrapper>
              <Button variant="primary" height={36} padding="4px 6px" href={LEGACY_PAGE} as="a">
                <span style={{ whiteSpace: 'nowrap', color: '#000' }}>{t('header.returnToLegacySite')}</span>
              </Button>
            </LegacyButtonWrapper>
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
            <PNGWrapper onClick={() => setShowPngBalanceModal(true)}>
              <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {CHAINS[chainId].png_symbol}
              </PNGAmount>
            </PNGWrapper>
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
          </HeaderElementWrap>
        </HeaderControls>
      )}
    </HeaderFrame>
  )
}

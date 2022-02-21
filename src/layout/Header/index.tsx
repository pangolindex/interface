import { ChainId, TokenAmount } from '@antiyro/sdk'
import { Button, Box } from '@0xkilo/components'
import React, { useContext, useState, useRef } from 'react'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useAggregatePngBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../../components/earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE } from '../../theme'
import Web3Status from '../../components/Web3Status'
import Modal from '../../components/Modal'
import PngBalanceContent from './PngBalanceContent'
import usePrevious from '../../hooks/usePrevious'
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
  MobileHeader,
  FooterMobileControls,
  MobileLogoWrapper,
  LegacyButtonWrapper
} from './styled'
import { useTranslation } from 'react-i18next'
import MobileFooter from '../MobileFooter'
import { Logo } from '../../components/Icons'
import { Hidden } from 'src/theme'

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.WAGMI]: 'Wagmi'
}

const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'AVAX',
  [ChainId.AVALANCHE]: 'AVAX',
  [ChainId.WAGMI]: 'WGM'
}

interface HeaderProps {
  onCollapsed: () => void
}

export default function Header({ onCollapsed }: HeaderProps) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const userEthBalance = useETHBalances(chainId || ChainId.AVALANCHE, account ? [account] : [])?.[account ?? '']

  const aggregateBalance: TokenAmount | undefined = useAggregatePngBalance()

  const [showPngBalanceModal, setShowPngBalanceModal] = useState(false)

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FARM)
  const toggle = useToggleModal(ApplicationModal.FARM)
  useOnClickOutside(node, open ? toggle : undefined)

  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <HeaderFrame>
      <Modal isOpen={showPngBalanceModal} onDismiss={() => setShowPngBalanceModal(false)}>
        <PngBalanceContent setShowPngBalanceModal={setShowPngBalanceModal} />
      </Modal>

      <MobileHeader>
        <MobileLogoWrapper>
          <Logo height={30} width={140} fillColor={theme.color6} />
        </MobileLogoWrapper>

        <Box display="flex" alignItems="center">
          <Web3Status />

          <ThemeMode onClick={() => toggleDarkMode()}>
            {isDark ? (
              <img width={'16px'} src={LightMode} alt={'Setting'} />
            ) : (
              <img width={'16px'} src={NightMode} alt={'NightMode'} />
            )}
          </ThemeMode>
        </Box>
      </MobileHeader>

      <FooterMobileControls>
        <MobileFooter />
      </FooterMobileControls>

      <HeaderControls>
        <HeaderElement>
          <LegacyButtonWrapper>
            <Button variant="primary" height={36} padding="4px 6px" href="/" as="a">
              <span style={{ whiteSpace: 'nowrap', color: '#000' }}>{t('header.returnToLegacySite')}</span>
            </Button>
          </LegacyButtonWrapper>
          <Hidden upToSmall={true}>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </Hidden>
          {aggregateBalance && (
            <PNGWrapper onClick={() => setShowPngBalanceModal(true)}>
              <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <Hidden upToSmall={true}>
                    <TYPE.black
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.black>
                  </Hidden>
                )}
                PNG
              </PNGAmount>
              <CardNoise />
            </PNGWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {chainId && account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {NETWORK_CURRENCY[chainId]}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <LanguageSelection isBeta={true} />
          <ThemeMode onClick={() => toggleDarkMode()}>
            {isDark ? (
              <img width={'16px'} src={LightMode} alt={'Setting'} />
            ) : (
              <img width={'16px'} src={NightMode} alt={'NightMode'} />
            )}
          </ThemeMode>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

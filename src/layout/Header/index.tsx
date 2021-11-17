import { ChainId, TokenAmount } from '@pangolindex/sdk'
import React, { useState, useRef } from 'react'
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
import Settings from '../../assets/svg/settings.svg'
import {
  HeaderFrame,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  AccountElement,
  PNGAmount,
  PNGWrapper,
  HideSmall,
  NetworkCard,
  BalanceText,
  ThemeMode,
  MobileHeader,
  StyledMenuIcon,
  MobileLogoWrapper
} from './styled'
import Logo from '../Logo'

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'Avalanche'
}

interface HeaderProps {
  onCollapsed: () => void
}

export default function Header({ onCollapsed }: HeaderProps) {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

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
    
        <StyledMenuIcon onClick={() => onCollapsed()} />
        <MobileLogoWrapper>
          <Logo collapsed={false} />
        </MobileLogoWrapper>
      </MobileHeader>

      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {aggregateBalance && (
            <PNGWrapper onClick={() => setShowPngBalanceModal(true)}>
              <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
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
                    </TYPE.white>
                  </HideSmall>
                )}
                PNG
              </PNGAmount>
              <CardNoise />
            </PNGWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} AVAX
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <LanguageSelection isBeta={true} />
          <ThemeMode onClick={() => toggleDarkMode()}>
            {isDark ? (
              <img width={'16px'} src={Settings} alt={'Setting'} />
            ) : (
              <img width={'16px'} src={NightMode} alt={'NightMode'} />
            )}
          </ThemeMode>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

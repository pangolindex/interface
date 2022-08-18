import React from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { LEGACY_PAGE, MENU_LINK } from '../../../constants'
import { Button, useTranslation } from '@pangolindex/components'
import { Sider, TopBar, LegacyButtonWrapper } from './styled'
import { Scrollbars } from 'react-custom-scrollbars'
import { MenuLinks } from '../../Sidebar/MenuLinks'
import { MainLink, OtherLink } from '../../types'
import { Vote } from '../../../components/Icons'
import BridgeIcon from '../../../assets/svg/menu/bridge.svg'
import GovernanceIcon from '../../../assets/svg/menu/governance.svg'
import { MenuIcon } from '../MenuIcon'
interface SidebarProps {
  activeDesktopMenu: boolean
  handleDesktopMenu: () => void
}

export default function DesktopMenu({ activeDesktopMenu, handleDesktopMenu }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location: any = useLocation()

  const mainLinks: MainLink[] = [
    {
      link: MENU_LINK.vote,
      icon: Vote,
      title: t('header.vote'),
      id: 'vote',
      isActive: location?.pathname?.startsWith(MENU_LINK.vote)
    }
  ]

  const pangolinLinks: OtherLink[] = [
    {
      link: 'https://docs.pangolin.exchange/pangolin/team',
      icon: GovernanceIcon,
      title: `${t('Team')}`,
      id: 'team'
    },
    {
      link: 'https://docs.pangolin.exchange',
      icon: GovernanceIcon,
      title: `${t('Docs')}`,
      id: 'docs'
    },
    {
      link: 'https://gov.pangolin.exchange',
      icon: GovernanceIcon,
      title: t('header.forum'),
      id: 'forum'
    },
    {
      link: 'https://docs.pangolin.exchange/security-and-contracts/audits',
      icon: GovernanceIcon,
      title: t('Audits'),
      id: 'audits'
    }
  ]

  const otherLinks: OtherLink[] = [
    {
      link: 'https://bridge.avax.network/',
      icon: BridgeIcon,
      title: `Avalanche ${t('header.bridge')}`,
      id: 'bridge'
    },
    {
      link: 'https://satellite.axelar.network/',
      icon: BridgeIcon,
      title: `Satellite ${t('header.bridge')}`,
      id: 'satellite-bridge'
    }
  ]

  return (
    <Sider collapsed={!activeDesktopMenu}>
      <TopBar collapsed={!activeDesktopMenu}>
        <MenuIcon active={activeDesktopMenu} handleMobileMenu={handleDesktopMenu} />
      </TopBar>
      <LegacyButtonWrapper>
        <Button variant="primary" height={36} padding="4px 6px" href={LEGACY_PAGE} as="a">
          <span style={{ whiteSpace: 'nowrap', color: '#000' }}>{t('header.returnToLegacySite')}</span>
        </Button>
      </LegacyButtonWrapper>
      <Scrollbars
        autoHeight
        autoHeightMax={height ? height - 150 : window.innerHeight - 150}
        autoHide
        style={{ flex: 1, overflowX: 'hidden' }}
      >
        <MenuLinks
          collapsed={!activeDesktopMenu}
          mainLinks={mainLinks}
          pangolinLinks={pangolinLinks}
          otherLinks={otherLinks}
        />
      </Scrollbars>
    </Sider>
  )
}

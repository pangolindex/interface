import React from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { LEGACY_PAGE, MENU_LINK } from 'src/constants'
import { Button, useTranslation } from '@pangolindex/components'
import { Sider, TopBar, LegacyButtonWrapper } from './styled'
import { Scrollbars } from 'react-custom-scrollbars'
import { MenuLinks } from 'src/layout/Sidebar/MenuLinks'
import { MainLink, OtherLink } from 'src/layout/types'
import { MenuIcon } from 'src/layout/Header/MenuIcon'
import BridgeIcon from 'src/assets/svg/menu/bridge.svg'
import { externalLinks, internalLinks } from 'src/layout/Header/MenuItems'

interface SidebarProps {
  activeDesktopMenu: boolean
  handleDesktopMenu: () => void
}

export default function DesktopMenu({ activeDesktopMenu, handleDesktopMenu }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location = useLocation()

  const mainLinks: MainLink[] = [
    {
      ...internalLinks.Vote,
      title: t('header.vote'),
      isActive: location?.pathname?.startsWith(MENU_LINK.vote)
    }
  ]

  const pangolinLinks: OtherLink[] = [
    {
      ...externalLinks.Team,
      title: `${t('Team')}`
    },
    {
      ...externalLinks.Docs,
      title: `${t('Docs')}`
    },
    {
      ...externalLinks.Forum,
      title: t('header.forum')
    },
    {
      ...externalLinks.Audits,
      title: t('Audits')
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

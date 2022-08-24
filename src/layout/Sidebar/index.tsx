import React from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { useTranslation } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import SocialMedia from 'src/layout/SocialMedia'
import Logo from 'src/layout/Logo'
import { Sider, CollapseBar, BottomBar } from './styled'
import { MenuLinks } from './MenuLinks'
import { MainLink, OtherLink } from 'src/layout/types'
import Backward from 'src/assets/svg/backward.svg'
import Forward from 'src/assets/svg/forward.svg'
import { externalLinks, internalLinks } from 'src/layout/Header/MenuItems'
import { MENU_LINK } from 'src/constants'
interface SidebarProps {
  collapsed: boolean
  onCollapsed: (isCollapsed: boolean) => void
}

export default function Sidebar({ collapsed, onCollapsed }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location = useLocation()

  const mainLinks: MainLink[] = [
    {
      ...internalLinks.Dashboard,
      title: t('header.dashboard'),
      isActive: location?.pathname?.startsWith(MENU_LINK.dashboard)
    },
    {
      ...internalLinks.Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith(MENU_LINK.swap)
    },
    {
      ...internalLinks.Buy,
      title: t('header.buy'),
      isActive: location?.pathname?.startsWith(MENU_LINK.buy)
    },
    {
      ...internalLinks.Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      isActive: location?.pathname?.startsWith(MENU_LINK.pool)
    },
    {
      ...internalLinks.Stake,
      title: t('header.stake'),
      isActive: location?.pathname?.startsWith(`${MENU_LINK.stake}/`)
    },
    {
      ...internalLinks.StakeV2,
      title: `${t('header.stake')} V2`,
      isActive: location?.pathname?.startsWith(MENU_LINK.stakev2)
    },
    {
      ...internalLinks.Airdrop,
      title: t('Airdrop'),
      isActive: location?.pathname?.startsWith(MENU_LINK.airdrop)
    },
    {
      ...internalLinks.Bridge,
      title: `${t('header.bridge')}`,
      isActive: location?.pathname?.startsWith(MENU_LINK.bridge)
    }
  ]

  const pangolinLinks: OtherLink[] = [
    {
      ...externalLinks.Charts,
      title: t('header.charts')
    }
  ]

  return (
    <Sider
      collapsed={collapsed}
      onMouseEnter={() => {
        onCollapsed(false)
      }}
      onMouseLeave={() => {
        if (!collapsed) {
          onCollapsed(true)
        }
      }}
    >
      <Logo collapsed={collapsed} />

      <Scrollbars
        autoHeight
        autoHeightMax={height ? height - 150 : window.innerHeight - 150}
        autoHide
        style={{ flex: 1, overflowX: 'hidden' }}
      >
        <MenuLinks collapsed={collapsed} mainLinks={mainLinks} pangolinLinks={pangolinLinks} />
      </Scrollbars>
      <BottomBar>
        <SocialMedia collapsed={collapsed} />
        <CollapseBar onClick={() => onCollapsed(!collapsed)}>
          {collapsed ? (
            <img height={'16px'} src={Forward} alt={'Forward'} />
          ) : (
            <img height={'16px'} src={Backward} alt={'Backward'} />
          )}
        </CollapseBar>
      </BottomBar>
    </Sider>
  )
}

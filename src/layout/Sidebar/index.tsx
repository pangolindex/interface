import React from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowSize } from '../../hooks/useWindowSize'
import SocialMedia from '../SocialMedia'
import { Dashboard, Swap, Stake, Pool, Buy, Airdrop, Bridge } from '../../components/Icons'
import { MENU_LINK } from 'src/constants'
import { useTranslation } from '@pangolindex/components'
import { Sider, CollapseBar, BottomBar } from './styled'
import Backward from '../../assets/svg/backward.svg'
import Forward from '../../assets/svg/forward.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import Logo from '../Logo'
import { MenuLinks } from './MenuLinks'
import { mainLink, otherLink } from '../types'
import Charts from '../../assets/svg/menu/analytics.svg'
import { ANALYTICS_PAGE } from '../../constants'
interface SidebarProps {
  collapsed: boolean
  onCollapsed: (isCollapsed: boolean) => void
}

export default function Sidebar({ collapsed, onCollapsed }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location: any = useLocation()

  const mainLinks: mainLink[] = [
    {
      link: MENU_LINK.dashboard,
      icon: Dashboard,
      title: t('header.dashboard'),
      id: 'dashboard',
      isActive: location?.pathname?.startsWith(MENU_LINK.dashboard)
    },
    {
      link: MENU_LINK.swap,
      icon: Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith(MENU_LINK.swap)
    },
    {
      link: MENU_LINK.buy,
      icon: Buy,
      title: t('header.buy'),
      id: 'buy',
      isActive: location?.pathname?.startsWith(MENU_LINK.buy)
    },
    {
      link: MENU_LINK.pool,
      icon: Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      id: 'pool',
      isActive: location?.pathname?.startsWith(MENU_LINK.pool)
    },
    {
      link: `${MENU_LINK.stake}/0`,
      icon: Stake,
      title: t('header.stake'),
      id: 'stake',
      isActive: location?.pathname?.startsWith(`${MENU_LINK.stake}/`)
    },
    {
      link: MENU_LINK.stakev2,
      icon: Stake,
      title: `${t('header.stake')} V2`,
      id: 'stakev2',
      isActive: location?.pathname?.startsWith(MENU_LINK.stakev2)
    },
    {
      link: MENU_LINK.airdrop,
      icon: Airdrop,
      title: 'Airdrop',
      id: 'airdrop',
      isActive: location?.pathname?.startsWith(MENU_LINK.airdrop)
    },
    {
      link: MENU_LINK.bridge,
      icon: Bridge,
      title: `${t('header.bridge')}`,
      id: 'bridge',
      isActive: location?.pathname?.startsWith(MENU_LINK.bridge)
    }
  ]

  const pangolinLinks: otherLink[] = [
    {
      link: ANALYTICS_PAGE,
      icon: Charts,
      title: t('header.charts'),
      id: 'charts'
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

import React, { useContext } from 'react'
import { Text, Box } from '@pangolindex/components'
import { useWindowSize } from '../../hooks/useWindowSize'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import SocialMedia from '../SocialMedia'
import {
  Sider,
  CollapseBar,
  Menu,
  MenuItem,
  MenuLink,
  MenuName,
  BottomBar,
  MenuExternalLink,
  MenuWrapper
} from './styled'
import Backward from '../../assets/svg/backward.svg'
import Forward from '../../assets/svg/forward.svg'
import { Dashboard, Swap, Stake, Pool, Buy, Vote, Migration } from '../../components/Icons'
import Charts from '../../assets/svg/menu/analytics.svg'
import Partners from '../../assets/svg/menu/partners.svg'
import { ANALYTICS_PAGE } from '../../constants'
import Bridge from '../../assets/svg/menu/bridge.svg'
import Governance from '../../assets/svg/menu/governance.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import Logo from '../Logo'

interface SidebarProps {
  collapsed: boolean
  onCollapsed: (isCollapsed: boolean) => void
}

export default function Sidebar({ collapsed, onCollapsed }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location: any = useLocation()
  const theme = useContext(ThemeContext)
  const mainLinks = [
    {
      link: '/beta/dashboard',
      icon: Dashboard,
      title: t('header.dashboard'),
      id: 'dashboard',
      isActive: location?.pathname?.startsWith('/beta/dashboard')
    },
    {
      link: '/beta/swap',
      icon: Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith('/beta/swap')
    },
    {
      link: '/beta/buy',
      icon: Buy,
      title: t('header.buy'),
      id: 'buy',
      isActive: location?.pathname?.startsWith('/beta/buy')
    },
    {
      link: '/beta/pool',
      icon: Pool,
      title: t('header.pool'),
      id: 'buy',
      isActive:
        location?.pathname?.startsWith('/beta/pool') ||
        location?.pathname.startsWith('/add') ||
        location?.pathname.startsWith('/remove') ||
        location?.pathname.startsWith('/create') ||
        location?.pathname.startsWith('/find')
    },
    {
      link: '/beta/stake/0',
      icon: Stake,
      title: t('header.stake'),
      id: 'stake',
      isActive: location?.pathname?.startsWith('/beta/stake')
    },

    {
      link: '/beta/vote',
      icon: Vote,
      title: t('header.vote'),
      id: 'vote',
      isActive: location?.pathname?.startsWith('/beta/vote')
    },

    {
      link: '/beta/migrate/1',
      icon: Migration,
      title: 'Migrate',
      id: 'migrate',
      isActive: location?.pathname?.startsWith('/beta/migrate/')
    }
  ]

  const pangolinLinks = [
    {
      link: ANALYTICS_PAGE,
      icon: Charts,
      title: t('header.charts'),
      id: 'charts'
    },
    {
      link: 'https://gov.pangolin.exchange',
      icon: Governance,
      title: t('header.forum'),
      id: 'forum'
    }
  ]

  const otherLinks = [
    {
      link: 'https://bridge.avax.network/',
      icon: Bridge,
      title: t('header.bridge'),
      id: 'bridge'
    },
    {
      link: 'https://satellite.axelar.network/',
      icon: Bridge,
      title: `Satellite ${t('header.bridge')}`,
      id: 'satellite-bridge'
    },
    {
      link: 'https://pangolin.exchange',
      icon: Partners,
      title: t('header.ourPartners'),
      id: 'our-partners'
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
        autoHeightMax={height ? height - 200 : window.innerHeight - 200}
        autoHide
        style={{ flex: 1, overflowX: 'hidden' }}
      >
        <MenuWrapper>
          <Menu>
            {mainLinks.map((x, index) => {
              const Icon = x.icon

              return (
                <MenuItem isActive={x.isActive} key={index}>
                  <MenuLink id={x.id} to={x.link}>
                    <Icon size={16} fillColor={x.isActive ? theme.color3 : theme.color2} />
                    {!collapsed && <MenuName fontSize={16}>{x.title}</MenuName>}
                  </MenuLink>
                </MenuItem>
              )
            })}
          </Menu>

          <Box mt={collapsed ? '0px' : '10px'} overflowY="hidden">
            {!collapsed && (
              <Box height={35} overflowY="hidden">
                <Text color="color2" fontSize={12}>
                  PANGOLIN LINKS{' '}
                </Text>
              </Box>
            )}

            {pangolinLinks.map((x, index) => {
              return (
                <MenuItem key={index}>
                  <MenuExternalLink id={x.id} href={x.link}>
                    <img src={x.icon} width={16} alt={x.title} />
                    {!collapsed && <MenuName fontSize={16}>{x.title}</MenuName>}
                  </MenuExternalLink>
                </MenuItem>
              )
            })}
          </Box>

          <Box mt={collapsed ? '0px' : '10px'}>
            {!collapsed && (
              <Box height={35} overflowY="hidden">
                <Text color="color2" fontSize={12}>
                  {t('header.usefulLinks')}
                </Text>
              </Box>
            )}

            {otherLinks.map((x, index) => {
              return (
                <MenuItem key={index}>
                  <MenuExternalLink id={x.id} href={x.link}>
                    <img src={x.icon} width={16} alt={x.title} />
                    {!collapsed && <MenuName fontSize={16}>{x.title}</MenuName>}
                  </MenuExternalLink>
                </MenuItem>
              )
            })}
          </Box>
        </MenuWrapper>
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

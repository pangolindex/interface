import React, { useContext } from 'react'
import { Text, Box } from '@pangolindex/components'
import { useDarkModeManager } from '../../state/user/hooks'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import SocialMedia from '../SocialMedia'
import Logo from '../../assets/svg/icon.svg'
import LogoDark from '../../assets/svg/icon.svg'
import {
  Sider,
  Title,
  PngIcon,
  LogoWrapper,
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
import { Swap, Dashboard, Stake } from '../../components/Icons'
import Charts from '../../assets/svg/menu/analytics.svg'
import Partners from '../../assets/svg/menu/partners.svg'
import { ANALYTICS_PAGE } from '../../constants'
import Bridge from '../../assets/svg/menu/bridge.svg'
import Governance from '../../assets/svg/menu/governance.svg'
import { Scrollbars } from 'react-custom-scrollbars'

interface SidebarProps {
  collapsed: boolean
  onCollapsed: (value: boolean) => void
}

export default function Sidebar({ collapsed, onCollapsed }: SidebarProps) {
  const [isDark] = useDarkModeManager()
  const { t } = useTranslation()
  const location: any = useLocation()
  const theme = useContext(ThemeContext)
  const mainLinks = [
    {
      link: '/swap',
      icon: Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith('/swap')
    },
    {
      link: '/buy',
      icon: Dashboard,
      title: t('header.buy'),
      id: 'buy',
      isActive: location?.pathname?.startsWith('/buy')
    },
    {
      link: '/pool',
      icon: Dashboard,
      title: t('header.pool'),
      id: 'buy',
      isActive:
        location?.pathname?.startsWith('/buy') ||
        location?.pathname.startsWith('/add') ||
        location?.pathname.startsWith('/remove') ||
        location?.pathname.startsWith('/create') ||
        location?.pathname.startsWith('/find')
    },

    {
      link: '/png/2',
      icon: Dashboard,
      title: t('header.farm'),
      id: 'farm',
      isActive: location?.pathname?.startsWith('/png')
    },

    {
      link: '/stake/0',
      icon: Stake,
      title: t('header.stake'),
      id: 'stake',
      isActive: location?.pathname?.startsWith('/stake')
    },

    {
      link: '/vote',
      icon: Dashboard,
      title: t('header.vote'),
      id: 'vote',
      isActive: location?.pathname?.startsWith('/vote')
    },

    {
      link: '/beta/migrate/1',
      icon: Dashboard,
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
      link: 'https://pangolin.exchange',
      icon: Partners,
      title: t('header.ourPartners'),
      id: 'our-partners'
    }
  ]

  return (
    <Sider collapsed={collapsed}>
      <LogoWrapper>
        <Box>
          <Title href=".">
            <PngIcon>
              <img width={'28px'} src={isDark ? LogoDark : Logo} alt="logo" />
            </PngIcon>
          </Title>
        </Box>
        {!collapsed && (
          <Box ml={12}>
            <Text color="text1" fontSize={16}>
              Pangolin
            </Text>
          </Box>
        )}
      </LogoWrapper>

      <Scrollbars autoHeight autoHeightMax={500}>
        <MenuWrapper>
          <Menu>
            {mainLinks.map((x, index) => {
              const Icon = x.icon

              return (
                <MenuItem isActive={x.isActive} collapsed={collapsed} key={index}>
                  <MenuLink id={x.id} to={x.link}>
                    <Icon size={16} fillColor={x.isActive ? theme.color3 : theme.color2} />
                    {!collapsed && <MenuName fontSize={16}>{x.title}</MenuName>}
                  </MenuLink>
                </MenuItem>
              )
            })}
          </Menu>

          <Box mt={collapsed ? '0px' : '10px'}>
            {!collapsed && (
              <Box height={35}>
                <Text color="color2" fontSize={12}>
                  PANGOLIN LINKS{' '}
                </Text>
              </Box>
            )}

            {pangolinLinks.map((x, index) => {
              return (
                <MenuItem collapsed={collapsed} key={index}>
                  <MenuExternalLink id={x.id} href={x.link}>
                    <img src={x.icon} width={16} />
                    {!collapsed && <MenuName fontSize={16}>{x.title}</MenuName>}
                  </MenuExternalLink>
                </MenuItem>
              )
            })}
          </Box>

          <Box mt={collapsed ? '0px' : '10px'}>
            {!collapsed && (
              <Box height={35}>
                <Text color="color2" fontSize={12}>
                  {t('header.usefulLinks')}
                </Text>
              </Box>
            )}

            {otherLinks.map((x, index) => {
              return (
                <MenuItem collapsed={collapsed} key={index}>
                  <MenuExternalLink id={x.id} href={x.link}>
                    <img src={x.icon} width={16} />
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
        <CollapseBar onClick={() => onCollapsed(!collapsed)} collapsed={collapsed}>
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

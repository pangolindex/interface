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
import { Dashboard, Swap, Stake, Pool, Buy, Vote, Migration, Airdrop } from '../../components/Icons'
import Charts from '../../assets/svg/menu/analytics.svg'
import { ANALYTICS_PAGE } from '../../constants'
import Bridge from '../../assets/svg/menu/bridge.svg'
import Governance from '../../assets/svg/menu/governance.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import Logo from '../Logo'
import { BETA_MENU_LINK } from 'src/constants'
import { useGetMigrationData } from 'src/state/migrate/hooks'
import { useAirdropIsClaimingAllowed } from 'src/state/airdrop/hooks'

interface SidebarProps {
  collapsed: boolean
  onCollapsed: (isCollapsed: boolean) => void
}

interface Link {
  link: string
  icon: string
  title: string
  id: string
}

export default function Sidebar({ collapsed, onCollapsed }: SidebarProps) {
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const location: any = useLocation()
  const theme = useContext(ThemeContext)

  const { allPool } = useGetMigrationData(1)
  const claimingAllowed = useAirdropIsClaimingAllowed()

  const mainLinks = [
    {
      link: BETA_MENU_LINK.dashboard,
      icon: Dashboard,
      title: t('header.dashboard'),
      id: 'dashboard',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.dashboard)
    },
    {
      link: BETA_MENU_LINK.swap,
      icon: Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.swap)
    },
    {
      link: BETA_MENU_LINK.buy,
      icon: Buy,
      title: t('header.buy'),
      id: 'buy',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.buy)
    },
    {
      link: BETA_MENU_LINK.pool,
      icon: Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      id: 'pool',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.pool)
    },
    {
      link: `${BETA_MENU_LINK.stake}/0`,
      icon: Stake,
      title: t('header.stake'),
      id: 'stake',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.stake)
    },

    {
      link: BETA_MENU_LINK.vote,
      icon: Vote,
      title: t('header.vote'),
      id: 'vote',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.vote)
    }
  ]

  // add v1
  if (Object.keys(allPool)?.length > 0) {
    mainLinks.push({
      link: `${BETA_MENU_LINK.migrate}/1`,
      icon: Migration,
      title: 'Migrate',
      id: 'migrate',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.migrate)
    })
  }

  if (claimingAllowed) {
    mainLinks.push({
      link: BETA_MENU_LINK.airdrop,
      icon: Airdrop,
      title: 'Airdrop',
      id: 'airdrop',
      isActive: location?.pathname?.startsWith(BETA_MENU_LINK.airdrop)
    })
  }

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
      title: `Avalanche ${t('header.bridge')}`,
      id: 'bridge'
    },
    {
      link: 'https://satellite.axelar.network/',
      icon: Bridge,
      title: `Satellite ${t('header.bridge')}`,
      id: 'satellite-bridge'
    }
  ]

  const createMenuLink = (link: Link, index: number) => {
    return (
      <MenuItem key={index}>
        <MenuExternalLink id={link.id} href={link.link}>
          <img src={link.icon} width={16} alt={link.title} />
          {!collapsed && <MenuName fontSize={16}>{link.title}</MenuName>}
        </MenuExternalLink>
      </MenuItem>
    )
  }

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
        <MenuWrapper>
          <Menu>
            {mainLinks.map((x, index) => {
              const Icon = x.icon

              return (
                <MenuItem isActive={x.isActive} key={index}>
                  <MenuLink id={x.id} to={x.link}>
                    <Icon size={16} fillColor={x.isActive ? theme.black : theme.color22} />
                    {!collapsed && (
                      <MenuName fontSize={16} color={x.isActive ? 'black' : undefined}>
                        {x.title}
                      </MenuName>
                    )}
                  </MenuLink>
                </MenuItem>
              )
            })}
          </Menu>

          <Box mt={collapsed ? '0px' : '10px'} overflowY="hidden">
            {!collapsed && (
              <Box height={35} overflowY="hidden">
                <Text color="color22" fontSize={12}>
                  PANGOLIN LINKS{' '}
                </Text>
              </Box>
            )}

            {pangolinLinks.map((x, index) => createMenuLink(x, index))}
          </Box>
          <Box mt={collapsed ? '0px' : '10px'}>
            {!collapsed && (
              <Box height={35} overflowY="hidden">
                <Text color="color22" fontSize={12}>
                  {t('header.usefulLinks')}
                </Text>
              </Box>
            )}

            {otherLinks.map((x, index) => createMenuLink(x, index))}
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

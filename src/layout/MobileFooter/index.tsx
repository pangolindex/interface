import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Menu, MenuItem, MenuLink, MenuWrapper } from './styled'
import { Dashboard, Swap, Stake, Pool } from '../../components/Icons'

export default function MobileFooter() {
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
      link: '/beta/pool',
      icon: Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      id: 'pool',
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
    }
  ]

  return (
    <MenuWrapper>
      <Menu>
        {mainLinks.map((x, index) => {
          const Icon = x.icon

          return (
            <MenuItem isActive={x.isActive} key={index}>
              <MenuLink id={x.id} to={x.link}>
                <Icon size={16} fillColor={x.isActive ? theme.black : theme.color22} />

                <Text fontSize={14} color={x.isActive && 'black'}>
                  {x.title}
                </Text>
              </MenuLink>
            </MenuItem>
          )
        })}
      </Menu>
    </MenuWrapper>
  )
}

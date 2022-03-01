import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Menu, MenuItem, MenuLink, MenuWrapper } from './styled'
import { Dashboard, Swap, Stake, Pool } from '../../components/Icons'
import { BETA_MENU_LINK } from 'src/constants'

export default function MobileFooter() {
  const { t } = useTranslation()
  const location: any = useLocation()
  const theme = useContext(ThemeContext)
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

                <Text fontSize={14} color={x.isActive ? 'black' : 'color22'}>
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

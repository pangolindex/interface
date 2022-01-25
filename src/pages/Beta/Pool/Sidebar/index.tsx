import React from 'react'
import { SidebarWrapper, Menu, MenuLink, MenuName, MenuItem, Circle } from './styleds'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'

export enum MenuType {
  allPoolV1 = 'allPoolV1',
  allPoolV2 = 'allPoolV2',
  yourPoolV1 = 'yourPoolV1',
  yourPoolV2 = 'yourPoolV2',
  yourWallet = 'your-wallet'
}

interface MenuProps {
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ title: string; value: string }>
}

const Sidebar = ({ setMenu, activeMenu, menuItems }: MenuProps) => {
  const { t } = useTranslation()

  return (
    <SidebarWrapper>
      <Text color="text1" fontSize={32} fontWeight={500} ml={20} mt={10}>
        {t('header.pool')}
      </Text>

      <Menu>
        {menuItems.map((x, index) => {
          return (
            <MenuItem isActive={x.value === activeMenu} key={index}>
              <MenuLink isActive={x.value === activeMenu} id={x.value} onClick={() => setMenu(x.value)} key={index}>
                {x.value === activeMenu && <Circle />}
                <MenuName fontSize={16}>{x.title}</MenuName>
              </MenuLink>
            </MenuItem>
          )
        })}
      </Menu>
    </SidebarWrapper>
  )
}
export default Sidebar

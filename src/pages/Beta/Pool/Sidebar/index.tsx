import React from 'react'
import { PageWrapper, Menu, MenuLink, MenuName, MenuItem, Circle } from './styleds'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'

export enum MenuType {
  poolV1 = 'totalStakedInUsd',
  poolV2 = 'multiplier',
  yourPool = 'your-pool',
  yourWallet = 'your-wallet'
}

interface MenuProps {
  setMenu: (value: string) => void
  activeMenu: string
}

const Sidebar = ({ setMenu, activeMenu }: MenuProps) => {
  const { t } = useTranslation()

  const mainLinks = [
    {
      title: 'All Pools (V1)',
      value: MenuType.poolV1
    },
    {
      title: 'All Pools (V2)',
      value: MenuType.poolV2
    },
    {
      title: 'Your Pools',
      value: MenuType.yourPool
    },
    {
      title: 'Your Wallet',
      value: MenuType.yourWallet
    }
  ]
  return (
    <PageWrapper>
      <Text color="text1" fontSize={32} fontWeight={500} ml={20} mt={10}>
        {t('header.pool')}
      </Text>

      <Menu>
        {mainLinks.map((x, index) => {
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
    </PageWrapper>
  )
}
export default Sidebar

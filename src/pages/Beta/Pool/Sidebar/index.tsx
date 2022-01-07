import React from 'react'
import { PageWrapper, Menu, MenuLink, MenuName, MenuItem, Circle } from './styleds'
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
}

const Sidebar = ({ setMenu, activeMenu }: MenuProps) => {
  const { t } = useTranslation()

  const mainLinks = [
    {
      title: `${t('pool.allPools')} (V1)`,
      value: MenuType.allPoolV1
    },
    {
      title: `${t('pool.allPools')} (V2)`,
      value: MenuType.allPoolV2
    },
    {
      title: `${t('pool.yourPools')} (V1)`,
      value: MenuType.yourPoolV1
    },
    {
      title: `${t('pool.yourPools')} (V2)`,
      value: MenuType.yourPoolV2
    },
    {
      title: `${t('pool.yourWallet')}`,
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

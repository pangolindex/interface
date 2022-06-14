import React, { useState, useCallback } from 'react'
import { SidebarWrapper, Menu, MenuLink, MenuName, MenuItem, Circle } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import PoolImportModal from '../PoolImportModal'

export enum MenuType {
  allFarmV1 = 'allFarmV1',
  allFarmV2 = 'allFarmV2',
  yourFarmV1 = 'yourFarmV1',
  yourFarmV2 = 'yourFarmV2',
  superFarm = 'superFarm',
  yourPool = 'your-pool'
}

interface MenuProps {
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
  onManagePoolsClick: () => void
}

const Sidebar = ({ setMenu, activeMenu, menuItems, onManagePoolsClick }: MenuProps) => {
  const { t } = useTranslation()
  const [isPoolImportModalOpen, setIsPoolImportModalOpen] = useState(false)

  const handlePoolImportModalClose = useCallback(() => {
    setIsPoolImportModalOpen(false)
  }, [setIsPoolImportModalOpen])
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
                <MenuName fontSize={16}>{x.label}</MenuName>
              </MenuLink>
            </MenuItem>
          )
        })}
      </Menu>

      <Box padding="8px" mb={10} ml="12px">
        <Text color="color6" fontSize={14}>
          {t('pool.noSeePoolJoined')}
        </Text>

        <Text fontSize={14} color="primary" onClick={() => setIsPoolImportModalOpen(true)} cursor="pointer">
          {t('pool.importIt')}
        </Text>
      </Box>

      <PoolImportModal
        isOpen={isPoolImportModalOpen}
        onClose={handlePoolImportModalClose}
        onManagePoolsClick={() => {
          setIsPoolImportModalOpen(false)
          onManagePoolsClick()
        }}
      />
    </SidebarWrapper>
  )
}
export default Sidebar

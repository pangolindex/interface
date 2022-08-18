import { Box } from '@pangolindex/components'
import React from 'react'
import { MenuIcon } from './MenuIcon'

interface Props {
  activeDesktopMenu: boolean
  handleDesktopMenu: () => void
}

export const DesktopHamburger: React.FC<Props> = ({ activeDesktopMenu, handleDesktopMenu }) => {
  return (
    <Box style={{ width: '29px', padding: '0.15rem 1rem', marginLeft: '0.5rem' }}>
      <MenuIcon active={activeDesktopMenu} handleMobileMenu={handleDesktopMenu} />
    </Box>
  )
}

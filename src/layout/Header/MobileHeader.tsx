import { Box } from '@pangolindex/components'
import React from 'react'
import Logo from '../Logo'
import { MenuIcon } from './MenuIcon'
import { MobileHeaderFrame, MobileLogoWrapper } from './styled'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

export const MobileHeader: React.FC<Props> = ({ activeMobileMenu, handleMobileMenu }) => {
  return (
    <MobileHeaderFrame>
      <MobileLogoWrapper>
        <Logo collapsed={false} />
      </MobileLogoWrapper>

      <Box display="flex" alignItems="center" position="relative">
        <MenuIcon active={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
      </Box>
    </MobileHeaderFrame>
  )
}

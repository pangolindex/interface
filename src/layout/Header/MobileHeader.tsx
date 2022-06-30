import { Box } from '@pangolindex/components'
import React, { useContext } from 'react'
import { Logo } from 'src/components/Icons'
import { ThemeContext } from 'styled-components'
import { MenuIcon } from './MenuIcon'
import { MobileHeaderFrame, MobileLogoWrapper } from './styled'

interface Props {
  activedMobileMenu: boolean
  handleMobileMenu: () => void
}

export const MobileHeader: React.FC<Props> = ({ activedMobileMenu, handleMobileMenu }) => {
  const theme = useContext(ThemeContext)
  return (
    <MobileHeaderFrame>
      <MobileLogoWrapper>
        <Logo height={30} width={140} fillColor={theme.color6} />
      </MobileLogoWrapper>

      <Box display="flex" alignItems="center" position="relative">
        <MenuIcon active={activedMobileMenu} handleMobileMenu={handleMobileMenu} />
      </Box>
    </MobileHeaderFrame>
  )
}

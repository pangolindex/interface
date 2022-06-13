import React from 'react'
import { Box } from '@pangolindex/components'
import Logo from 'src/assets/svg/logoIcon.svg'
import LogoSlogan from 'src/assets/svg/logoWithSlogan.svg'
import { Title, LogoWrapper } from './styled'

interface LogoProps {
  collapsed: boolean
}

export default function LogoIcon({ collapsed }: LogoProps) {
  return (
    <LogoWrapper collapsed={collapsed}>
      <Box>
        <Title href=".">
          {!collapsed ? (
            <img height="28px" src={LogoSlogan} alt="logo" />
          ) : (
            <img width="28px" src={Logo} alt="logo" />
          )}
        </Title>
      </Box>
    </LogoWrapper>
  )
}

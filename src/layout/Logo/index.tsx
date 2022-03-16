import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { useDarkModeManager } from '../../state/user/hooks'
import Logo from 'src/assets/images/logo_light.svg'
import LogoDark from 'src/assets/images/logo_dark.svg'
import { Title, LogoWrapper } from './styled'

interface LogoProps {
  collapsed: boolean
}

export default function LogoIcon({ collapsed }: LogoProps) {
  const [isDark] = useDarkModeManager()

  return (
    <LogoWrapper collapsed={collapsed}>
      <Box>
        <Title href=".">
          <img width={'28px'} src={isDark ? LogoDark : Logo} alt="logo" />
        </Title>
      </Box>
      {!collapsed && (
        <Box ml={12}>
          <Text color="text1" fontSize={16}>
            Pangolin
          </Text>
        </Box>
      )}
    </LogoWrapper>
  )
}

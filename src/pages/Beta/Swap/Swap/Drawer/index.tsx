import React, { useContext } from 'react'
import { useWindowSize } from '../../../../../hooks/useWindowSize'
import { Sider, MenuWrapper } from './styled'
import { Scrollbars } from 'react-custom-scrollbars'
import { CloseIcon } from '../../../../../theme/components'
import { Box, Text } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

interface DrawerProps {
  collapsed: boolean
  onCollapsed: (isCollapsed: boolean) => void
  children?: React.ReactNode
  title?: string
}

export default function Drawer({ collapsed, onCollapsed, children, title }: DrawerProps) {
  const { height } = useWindowSize()
  const theme = useContext(ThemeContext)
  return (
    <Sider collapsed={collapsed}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text color="text1" fontSize={24}>
          {title}
        </Text>
        <CloseIcon
          onClick={() => {
            onCollapsed(false)
          }}
          color={theme.text4}
        />
      </Box>
      <Scrollbars
        autoHeight
        autoHeightMax={height ? height - 200 : window.innerHeight - 200}
        autoHide
        style={{ flex: 1, overflowX: 'hidden' }}
      >
        <MenuWrapper>{children}</MenuWrapper>
      </Scrollbars>
    </Sider>
  )
}

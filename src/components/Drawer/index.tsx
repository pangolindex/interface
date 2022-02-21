import React, { useContext } from 'react'
import { DrawerRoot, DrawerContent } from './styled'
import { CloseIcon } from 'src/theme/components'
import { Box, Text } from '@0xkilo/components'
import { ThemeContext } from 'styled-components'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  title?: string
}

export default function Drawer({ isOpen, onClose, children, title }: DrawerProps) {
  const theme = useContext(ThemeContext)
  return (
    <DrawerRoot isOpen={isOpen}>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
        <Text color="text1" fontSize={24}>
          {title}
        </Text>
        <CloseIcon onClick={onClose} color={theme.text4} />
      </Box>
      <DrawerContent>{children}</DrawerContent>
    </DrawerRoot>
  )
}

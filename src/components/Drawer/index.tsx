import React, { useContext } from 'react'
import { DrawerRoot, DrawerContent } from './styled'
import { CloseIcon } from 'src/theme/components'
import { Box, Text } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  title?: string
  backgroundColor?: string
}

export default function Drawer({ isOpen, onClose, children, title, backgroundColor }: DrawerProps) {
  const theme = useContext(ThemeContext)
  return (
    <DrawerRoot isOpen={isOpen} backgroundColor={backgroundColor}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px 10px 0 10px">
          <Text color="text1" fontSize={24}>
            {title}
          </Text>
        </Box>
      )}

      <Box position="absolute" right={10} top={10}>
        <CloseIcon onClick={onClose} color={theme.text4} />
      </Box>

      <DrawerContent>{children}</DrawerContent>
    </DrawerRoot>
  )
}

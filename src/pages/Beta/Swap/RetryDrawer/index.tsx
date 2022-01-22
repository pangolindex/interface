import React from 'react'
import { Divider } from './styled'
import { Text, Box } from '@pangolindex/components'
import Drawer from '../../components/Drawer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const RetryDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Drawer title="Re-tries" isOpen={isOpen} onClose={onClose}>
      <Box>
        <Text color="text1" fontSize={16} fontWeight={500} marginLeft={10}>
          1
        </Text>
        <Divider />
      </Box>
    </Drawer>
  )
}
export default RetryDrawer

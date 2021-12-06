import React from 'react'
// import { Divider } from './styled'
import { Box, TextInput } from '@pangolindex/components'
import Drawer from '../Drawer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const TokenListDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Drawer title="Manage Lists" isOpen={isOpen} onClose={onClose}>
      {/* Render Search Token Input */}
      <Box padding="0px 10px">
        <TextInput
          placeholder="https:// or ipfs://"
          // onChange={(value: any) => {
          //   setSearchQuery(value as string)
          // }}
        />
      </Box>
    </Drawer>
  )
}
export default TokenListDrawer

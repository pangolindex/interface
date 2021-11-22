import React from 'react'
import { Text, Box } from '@pangolindex/components'

export interface StatProps {
  title?: React.ReactNode
  titlePosition: 'top' | 'bottom'
  stat?: any
}

const Stat = ({ title, titlePosition, stat }: StatProps) => {
  return (
    <Box display="inline-block">
      {titlePosition === 'top' && (
        <Text color="text1" fontSize={20}>
          {title}
        </Text>
      )}

      <Text color="text1" fontSize={16}>
        {stat}
      </Text>

      {titlePosition === 'bottom' && (
        <Text color="text1" fontSize={16}>
          {title}
        </Text>
      )}
    </Box>
  )
}

export default Stat

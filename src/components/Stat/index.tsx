import React from 'react'
import { Text, Box } from '@pangolindex/components'

export interface StatProps {
  title?: React.ReactNode
  titlePosition: 'top' | 'bottom'
  stat?: any
  titleColor?: string
  statColor?: string
  titleFontSize?: number
  statFontSize?: number
}

const Stat = ({ title, titlePosition, stat, titleColor, titleFontSize, statColor, statFontSize }: StatProps) => {
  return (
    <Box display="inline-block">
      {titlePosition === 'top' && (
        <Text color={titleColor || 'text1'} fontSize={titleFontSize || 20}>
          {title}
        </Text>
      )}

      <Text color={statColor || 'text1'} fontSize={statFontSize || 16}>
        {stat}
      </Text>

      {titlePosition === 'bottom' && (
        <Text color={titleColor || 'text1'} fontSize={titleFontSize || 16}>
          {title}
        </Text>
      )}
    </Box>
  )
}

export default Stat

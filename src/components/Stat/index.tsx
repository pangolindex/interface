import React from 'react'
import { Text, Box, CurrencyLogo } from '@pangolindex/components'
import { Currency } from '@pangolindex/sdk'
import { Colors } from 'src/theme/styled'

export interface StatProps {
  title?: React.ReactNode
  titlePosition?: 'top' | 'bottom'
  stat?: any
  titleColor?: keyof Colors
  statColor?: keyof Colors
  titleFontSize?: number
  statFontSize?: number
  currency?: Currency
  statAlign?: 'center' | 'right' | 'left'
}

const Stat = ({
  title,
  titlePosition,
  stat,
  titleColor,
  titleFontSize,
  statColor,
  statFontSize,
  currency,
  statAlign
}: StatProps) => {
  return (
    <Box display="inline-block">
      {titlePosition === 'top' && title && (
        <Text color={titleColor || 'text1'} fontSize={titleFontSize || 20}>
          {title}
        </Text>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent={statAlign === 'center' ? 'center' : statAlign === 'right' ? 'flex-end' : 'flex-start'}
      >
        <Text color={statColor || 'text1'} fontSize={statFontSize || 16}>
          {stat}
        </Text>
        {currency && (
          <Box ml={10} mt="8px">
            <CurrencyLogo currency={currency} size={'18px'} />
          </Box>
        )}
      </Box>

      {titlePosition === 'bottom' && title && (
        <Text color={titleColor || 'text1'} fontSize={titleFontSize || 16}>
          {title}
        </Text>
      )}
    </Box>
  )
}

export default Stat

import React from 'react'
import { Text, Box, CurrencyLogo, ANALYTICS_PAGE_MAPPING } from '@pangolindex/components'
import { Currency, Token, WAVAX } from '@pangolindex/sdk'
import { Colors } from 'src/theme/styled'
import { useChainId } from 'src/hooks'
import { ReactComponent as AnalyticsIcon } from 'src/assets/svg/menu/statatics.svg'
import { AnalyticsLink } from './styled'

export interface StatProps {
  title?: React.ReactNode
  titlePosition?: 'top' | 'bottom'
  stat?: any
  titleColor?: keyof Colors
  statColor?: keyof Colors
  titleFontSize?: number | number[]
  statFontSize?: number | number[]
  currency?: Currency
  statAlign?: 'center' | 'right' | 'left'
  showAnalytics?: boolean
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
  statAlign,
  showAnalytics = false
}: StatProps) => {
  const chainId = useChainId()
  const analyticsPageUrl = ANALYTICS_PAGE_MAPPING[chainId]
  const token = currency instanceof Currency && currency instanceof Token ? currency : WAVAX[chainId]
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={statAlign === 'center' ? 'center' : statAlign === 'right' ? 'flex-end' : 'flex-start'}
    >
      {titlePosition === 'top' && title && (
        <Box display="flex" flexDirection="row" style={{ gap: '5px' }} alignItems="center">
          <Text color={titleColor || 'text1'} fontSize={titleFontSize || 20}>
            {title}
          </Text>
          {showAnalytics && (
            <AnalyticsLink href={`${analyticsPageUrl}/#/token/${token.address}`} target="_blank">
              <AnalyticsIcon />
            </AnalyticsLink>
          )}
        </Box>
      )}

      <Box display="flex" alignItems="center">
        <Text color={statColor || 'text1'} fontSize={statFontSize || 16}>
          {stat}
        </Text>
        {currency && (
          <Box ml={10} mt="8px">
            <CurrencyLogo currency={currency} size={24} imageSize={48} />
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

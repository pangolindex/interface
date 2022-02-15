import { CurrencyLogo, Text, Box } from '@pangolindex/components'
import { Trade } from '@antiyro/sdk'
import React, { useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { SwapRouteWrapper } from './styled'

type Props = {
  trade: Trade
}

const SwapRoute: React.FC<Props> = ({ trade }) => {
  const theme = useContext(ThemeContext)
  return (
    <SwapRouteWrapper>
      {trade.route.path.map((token, i, path) => {
        const isLastItem = i === path.length - 1

        return (
          <Box key={i} display="flex" alignItems="center">
            <Box display="flex" alignItems="center" my={'5px'}>
              <CurrencyLogo currency={token} size="1.5rem" />
              <Box ml={'10px'}>
                <Text fontSize={14} color={'text1'}>
                  {token.symbol}
                </Text>
              </Box>
            </Box>
            {isLastItem ? null : <ChevronRight color={theme.text2} />}
          </Box>
        )
      })}
    </SwapRouteWrapper>
  )
}

export default SwapRoute

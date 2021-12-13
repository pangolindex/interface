import React, { useState } from 'react'
import { Text, Box, ToggleButtons } from '@pangolindex/components'
import { Root, SwapWrapper, SwapAlertBox } from './styled'
import MarketOrder from './MarketOrder'
import LimitOrder from './LimitOrder'

const SwapWidget = () => {
  const [swapType, setSwapType] = useState('MARKET' as string)

  return (
    <Root>
      <SwapWrapper>
        <SwapAlertBox>This is a BETA release and should be used at your own risk!</SwapAlertBox>

        <Box p={10}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text color="text1" fontSize={24} fontWeight={500}>
              Trade
            </Text>
            <ToggleButtons
              options={['MARKET', 'LIMIT']}
              value={swapType}
              onChange={value => {
                setSwapType(value)
              }}
            />
          </Box>

          {swapType === 'LIMIT' ? <LimitOrder /> : <MarketOrder />}
        </Box>
      </SwapWrapper>
    </Root>
  )
}
export default SwapWidget

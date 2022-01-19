import React, { useState } from 'react'
import { Root } from './styled'
import MarketOrder from './MarketOrder'
import LimitOrder from './LimitOrder'

const SwapWidget = () => {
  const [swapType, setSwapType] = useState('MARKET' as string)

  return (
    <Root>
      {swapType === 'LIMIT' ? (
        <LimitOrder
          swapType={swapType}
          setSwapType={type => {
            setSwapType(type)
          }}
        />
      ) : (
        <MarketOrder
          swapType={swapType}
          setSwapType={type => {
            setSwapType(type)
          }}
        />
      )}
    </Root>
  )
}
export default SwapWidget

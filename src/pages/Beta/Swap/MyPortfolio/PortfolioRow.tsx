import React from 'react'
import { Text, Box, CurrencyLogo, DoubleCurrencyLogo } from '@pangolindex/components'
import { Pair, Token } from '@pangolindex/sdk'
import { RowWrapper } from './styleds'

type Props = {
  coin?: Token
  pair?: Pair
}

const PortfolioRow: React.FC<Props> = ({ coin, pair }) => {
  return (
    <RowWrapper>
      <Box display="flex" alignItems="center">
        {coin && <CurrencyLogo size={'28px'} currency={coin} />}
        {pair && <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={28} />}
        {coin && (
          <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
            {coin.symbol}
          </Text>
        )}
        {pair && (
          <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
            {pair?.token0?.symbol} - {pair?.token1?.symbol}
          </Text>
        )}
      </Box>
      <Box ml={'10px'} textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          $120
        </Text>
      </Box>
    </RowWrapper>
  )
}

export default PortfolioRow

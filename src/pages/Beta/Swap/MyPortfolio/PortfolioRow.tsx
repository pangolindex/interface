import React from 'react'
import { Text, Box, CurrencyLogo, DoubleCurrencyLogo } from '@pangolindex/components'
import { RowWrapper } from './styleds'
import { PairDataUser, TokenDataUser } from 'src/state/portfolio/hooks'

type Props = {
  coin?: TokenDataUser
  pair?: PairDataUser
}

const PortfolioRow: React.FC<Props> = ({ coin, pair }) => {
  const fontSize = (value: number) => {
    let size = 20
    for (let index = 0; index < 10; index++) {
      const calcsize = Math.trunc(value / (10_000 * 10 ** index))
      if (calcsize === 0) {
        size = 20 - 2 * (index - 1)
        break
      }
    }
    return size
  }

  return (
    <RowWrapper>
      <Box display="flex" alignItems="center">
        {coin && <CurrencyLogo size={24} currency={coin.token} />}
        {pair && <DoubleCurrencyLogo currency0={pair?.pair?.token0} currency1={pair?.pair?.token1} size={24} />}
        {coin && (
          <Text color="text1" fontSize={fontSize(coin?.price * coin?.amount)} fontWeight={500} marginLeft={'6px'}>
            {coin?.token?.symbol}
          </Text>
        )}
        {pair && (
          <Text color="text1" fontSize={fontSize(pair?.usdValue)} fontWeight={500} marginLeft={'6px'}>
            {pair?.pair?.token0?.symbol} - {pair?.pair?.token1?.symbol}
          </Text>
        )}
      </Box>
      <Box textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          $
          {coin && !pair
            ? (coin?.price * coin?.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : 0}
          {pair && !coin
            ? pair?.usdValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : 0}
        </Text>
      </Box>
    </RowWrapper>
  )
}

export default PortfolioRow

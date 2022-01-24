import React from 'react'
import { Text, Box, CurrencyLogo, DoubleCurrencyLogo } from '@pangolindex/components'
import { RowWrapper } from './styleds'
import { PairDataUser, TokenDataUser } from 'src/state/portifolio/hooks'

type Props = {
  coin?: TokenDataUser
  pair?: PairDataUser
}

const PortfolioRow: React.FC<Props> = ({ coin, pair }) => {

  return (
    <RowWrapper>
      <Box display="flex" alignItems="center">
        {coin && <CurrencyLogo size={'28px'} currency={coin.token} />}
        {pair && <DoubleCurrencyLogo currency0={pair?.pair?.token0} currency1={pair?.pair?.token1} size={28} />}
        {coin && (
          <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
            {coin?.token?.symbol}
          </Text>
        )}
        {pair && (
          <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
            {pair?.pair?.token0?.symbol} - {pair?.pair?.token1?.symbol}
          </Text>
        )}
      </Box>
      <Box textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          ${!!coin
            ? (coin?.price * coin?.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : !!pair
              ? (pair?.price * pair?.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
              : 0
          }
        </Text>
      </Box>
    </RowWrapper>
  )
}

export default PortfolioRow

import React, { useCallback } from 'react'
import { Text, Box, CurrencyLogo, Button } from '@pangolindex/components'
import { Token } from '@pangolindex/sdk'
import { RowWrapper } from './styled'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useIsSelectedCurrency } from 'src/state/watchlists/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useChainId } from 'src/hooks'

type Props = {
  currency: Token
  onSelect: (address: string) => void
  style: any
}

const WatchlistCurrencyRow: React.FC<Props> = ({ currency, onSelect, style }) => {
  const usdcPrice = useUSDCPrice(currency)
  const isSelected = useIsSelectedCurrency(currency?.address)

  const handleSelect = useCallback(() => {
    onSelect(currency?.address)
  }, [onSelect, currency])

  const token = unwrappedToken(currency, useChainId())

  return (
    <RowWrapper disabled={isSelected} style={style}>
      <Box display="flex" alignItems="center">
        <CurrencyLogo size={'28px'} currency={token} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {token?.symbol}
        </Text>
      </Box>

      <Box ml={'10px'} textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          ${usdcPrice ? usdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}
        </Text>
      </Box>
      <Box ml={'10px'} textAlign="right">
        <Button
          variant="secondary"
          backgroundColor="bg9"
          color="text6"
          padding={'0px'}
          onClick={handleSelect}
          height="24px"
        >
          Add
        </Button>
      </Box>
    </RowWrapper>
  )
}

export default WatchlistCurrencyRow

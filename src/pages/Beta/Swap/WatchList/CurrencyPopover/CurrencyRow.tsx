import React, { useCallback } from 'react'
import { Text, Box, CurrencyLogo, Button } from '@pangolindex/components'
import { Token } from '@pangolindex/sdk'
import { RowWrapper } from './styled'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useIsSelectedCurrency } from 'src/state/watchlists/hooks'

type Props = {
  currency: Token
  onSelect: (address: string) => void
}

const WatchlistRow: React.FC<Props> = ({ currency, onSelect }) => {
  const usdcPrice = useUSDCPrice(currency)
  const isSelected = useIsSelectedCurrency(currency?.address)

  const handleSelect = useCallback(() => {
    onSelect(currency?.address)
  }, [onSelect, currency])

  return (
    <RowWrapper disabled={isSelected}>
      <Box display="flex" alignItems="center">
        <CurrencyLogo size={'28px'} currency={currency} />
        <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
          {currency?.symbol}
        </Text>
      </Box>

      <Box ml={'10px'} textAlign="right">
        <Text color="text1" fontSize={16} fontWeight={500}>
          ${usdcPrice ? usdcPrice?.toSignificant(4, { groupSeparator: ',' }) : '-'}
        </Text>
      </Box>
      <Box ml={'10px'} textAlign="right">
        <Button variant="secondary" backgroundColor="bg9" color="text6" padding={'0px'} onClick={handleSelect}>
          Add
        </Button>
      </Box>
    </RowWrapper>
  )
}

export default WatchlistRow

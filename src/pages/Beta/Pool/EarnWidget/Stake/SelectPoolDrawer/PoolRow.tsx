import React, { useCallback } from 'react'
import { Text, DoubleCurrencyLogo, Box } from '@pangolindex/components'
import { CurrencyRowRoot, Balance } from './styled'
import { Pair } from '@pangolindex/sdk'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useGetPoolDollerWorth } from 'src/state/stake/hooks'

interface Props {
  pair: Pair
  style: any
  onSelect: (pair: Pair) => void
  isSelected: boolean
}

const PoolRow: React.FC<Props> = props => {
  const { pair, style, onSelect, isSelected } = props

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const { userPgl } = useGetPoolDollerWorth(pair)

  const handleSelect = useCallback(() => {
    onSelect(pair)
  }, [onSelect, pair])

  return (
    <CurrencyRowRoot style={style} onClick={handleSelect} disabled={isSelected}>
      <Box display="flex" alignItems="center">
        <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
        <Text color="text2" fontSize={16} fontWeight={500} lineHeight="40px" marginLeft={10}>
          {currency0?.symbol}/{currency1?.symbol}
        </Text>
      </Box>
      <Balance color="text1" fontSize={14}>
        {userPgl ? userPgl.toSignificant(4) : '-'}
      </Balance>
    </CurrencyRowRoot>
  )
}
export default PoolRow

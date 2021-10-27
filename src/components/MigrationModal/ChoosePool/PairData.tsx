import React from 'react'
import { Pair } from '@pangolindex/sdk'
import { PairBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Checkbox } from '@pangolindex/components'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'

export interface PairDataProps {
  pair: Pair
  selected: boolean
  address: string
  toggleIndividualSelect: (address: string) => void
}

const PairData = ({ pair, selected, address, toggleIndividualSelect }: PairDataProps) => {
  const { account } = useActiveWeb3React()

  const currency0 = pair.token0
  const currency1 = pair.token1

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  return (
    <PairBox>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Checkbox value={address} checked={selected} onChange={() => toggleIndividualSelect(address)} />
        <Box ml="5px" mr="5px">
          <DoubleCurrencyLogo size={25} currency0={currency0} currency1={currency1} />
        </Box>
        <Text color="text1" fontSize={16}>
          PGL - {currency0.symbol}-{currency1.symbol} Pool
        </Text>
      </Box>
      <Box>
        <Text color="text1" fontSize={16}>
          {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} PGL
        </Text>
      </Box>
    </PairBox>
  )
}

export default PairData

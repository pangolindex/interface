import React from 'react'
import { Pair } from '@pangolindex/sdk'
import { PairBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Checkbox } from '@pangolindex/components'
import { StakingInfo } from '../../../state/stake/hooks'
import { useGetPairDataFromPair } from '../../../state/stake/hooks'

export interface PairDataProps {
  pair: Pair
  stackingData: StakingInfo | undefined
  selected: boolean
  address: string
  toggleIndividualSelect: (address: string) => void
}

const PairData = ({ pair, stackingData, selected, address, toggleIndividualSelect }: PairDataProps) => {
  const { currency0, currency1 } = useGetPairDataFromPair(pair)

  let totalLiqAmount = stackingData?.stakedAmount

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
          {totalLiqAmount ? totalLiqAmount.toSignificant(4) : '-'} PGL
        </Text>
      </Box>
    </PairBox>
  )
}

export default PairData

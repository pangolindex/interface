import React from 'react'
import { Pair } from '@pangolindex/sdk'
import { PairBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Checkbox, useTranslation } from '@pangolindex/components'
import { useGetPairDataFromPair, StakingInfo } from '../../../state/stake/hooks'

export interface PairDataProps {
  pair: Pair
  stakingData: StakingInfo | undefined
  selected: boolean
  address: string
  toggleIndividualSelect: (address: string) => void
}

const PairData = ({ pair, selected, address, toggleIndividualSelect }: PairDataProps) => {
  const { currency0, currency1 } = useGetPairDataFromPair(pair)

  const { t } = useTranslation()
  return (
    <PairBox
      onClick={() => {
        toggleIndividualSelect(address)
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Checkbox value={address} checked={selected} onChange={() => toggleIndividualSelect(address)} />
        <Box ml="5px" mr="5px">
          <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
        </Box>
        <Text color="text1" fontSize={16}>
          {currency0.symbol}-{currency1.symbol} {t('migratePage.pool')}
        </Text>
      </Box>
    </PairBox>
  )
}

export default PairData

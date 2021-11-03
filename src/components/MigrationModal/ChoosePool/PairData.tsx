import React from 'react'
import { Pair } from '@pangolindex/sdk'
import { PairBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Checkbox } from '@pangolindex/components'
import { StakingInfo } from '../../../state/stake/hooks'
import { useGetPairDataFromPair } from '../../../state/stake/hooks'
import { useTranslation } from 'react-i18next'

export interface PairDataProps {
  pair: Pair
  stakingData: StakingInfo | undefined
  selected: boolean
  address: string
  toggleIndividualSelect: (address: string) => void
}

const PairData = ({ pair, stakingData, selected, address, toggleIndividualSelect }: PairDataProps) => {
  const { currency0, currency1 } = useGetPairDataFromPair(pair)

  let totalLiqAmount = stakingData?.stakedAmount
  const { t } = useTranslation()
  return (
    <PairBox>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Checkbox value={address} checked={selected} onChange={() => toggleIndividualSelect(address)} />
        <Box ml="5px" mr="5px">
          <DoubleCurrencyLogo size={25} currency0={currency0} currency1={currency1} />
        </Box>
        <Text color="text1" fontSize={16}>
          PGL - {currency0.symbol}-{currency1.symbol} {t('migratePage.pool')}
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

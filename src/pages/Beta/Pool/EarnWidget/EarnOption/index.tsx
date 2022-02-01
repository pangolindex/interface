import React from 'react'
import { Text, Box, ToggleButtons } from '@pangolindex/components'
import { EarnWrapper } from './styled'

interface Props {
  type: string
  setType: (value: string) => void
}

const TradeOption: React.FC<Props> = ({ type, setType }) => {
  return (
    <EarnWrapper>
      <Box p={10}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {type === 'POOLS' ? 'Pools' : 'Farms'}
          </Text>
          <ToggleButtons
            options={['POOLS', 'FARMS']}
            value={type}
            onChange={value => {
              setType(value)
            }}
          />
        </Box>
      </Box>
    </EarnWrapper>
  )
}
export default TradeOption

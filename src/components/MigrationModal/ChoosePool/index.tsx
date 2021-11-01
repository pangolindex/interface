import React from 'react'
import { Wrapper } from './styleds'
import { Text, Checkbox, Box, Button } from '@pangolindex/components'
import { Pair } from '@pangolindex/sdk'
import PairData from './PairData'
import { StakingInfo } from '../../../state/stake/hooks'

export interface ChoosePoolProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allPool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  v2IsLoading: boolean
  toggleSelectAll: (value: boolean) => void
  toggleIndividualSelect: (address: string) => void
  goNext: () => void
}

const ChoosePool = ({
  allChoosePool,
  allPool,
  v2IsLoading,
  toggleSelectAll,
  toggleIndividualSelect,
  goNext
}: ChoosePoolProps) => {
  return (
    <Wrapper>
      <Text color="text4" fontSize={16}>
        We have realized you have these pools… Choose one or add one.
      </Text>
      <Box p={10}>
        <Checkbox
          label="Select all"
          onChange={check => {
            toggleSelectAll(check)
          }}
          checked={(Object.keys(allPool) || []).length === (Object.keys(allChoosePool) || []).length}
        />
      </Box>

      <Box maxHeight="200px" overflowY="auto">
        {(Object.keys(allPool) || []).map(address => {
          return (
            <PairData
              key={address}
              pair={allPool[address]?.pair}
              stackingData={allPool[address]?.staking}
              selected={!!allChoosePool[address]}
              address={address}
              toggleIndividualSelect={toggleIndividualSelect}
            />
          )
        })}
      </Box>
      <Box mt={30}>
        <Button
          variant='primary'
          onClick={() => {
            if ((Object.keys(allChoosePool) || []).length > 0) {
              goNext()
            }
          }}
          isDisabled={v2IsLoading || (Object.keys(allChoosePool) || []).length === 0}
        >
          Choose Pool
        </Button>
      </Box>
    </Wrapper>
  )
}
export default ChoosePool

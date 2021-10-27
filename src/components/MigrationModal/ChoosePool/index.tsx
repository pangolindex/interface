import React from 'react'
import { Wrapper } from './styleds'
import { Text, Checkbox, Box, Button } from '@pangolindex/components'
import { Pair } from '@pangolindex/sdk'
import PairData from './PairData'

export interface ChoosePoolProps {
  allChoosePool: { [address: string]: Pair }
  v2PairData: { [address: string]: Pair }
  v2IsLoading: Boolean
  toggleSelectAll: (value: boolean) => void
  toggleIndividualSelect: (address: string) => void
  goNext: () => void
}

const ChoosePool = ({
  allChoosePool,
  v2PairData,
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
          checked={(Object.keys(v2PairData) || []).length === (Object.keys(allChoosePool) || []).length}
        />
      </Box>

      <Box maxHeight="200px" overflowY="auto">
        {(Object.keys(v2PairData) || []).map(address => {
          return (
            <PairData
              key={address}
              pair={v2PairData[address]}
              selected={!!allChoosePool[address]}
              address={address}
              toggleIndividualSelect={toggleIndividualSelect}
            />
          )
        })}
      </Box>
      <Box mt={30}>
        <Button
          variant="primary"
          onClick={() => {
            if ((Object.keys(allChoosePool) || []).length > 0) {
              goNext()
            }
          }}
        >
          Choose Pool
        </Button>
      </Box>
    </Wrapper>
  )
}
export default ChoosePool

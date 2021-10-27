import React, { useState } from 'react'
import { Wrapper } from './styleds'
import { Box, Button } from '@pangolindex/components'
import { Pair } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'

export interface UnstakeProps {
  allChoosePool: { [address: string]: Pair }
  goNext: () => void
  allChoosePoolLength: number
}

const Stake = ({ allChoosePool, goNext, allChoosePoolLength }: UnstakeProps) => {
  const [index, setIndex] = useState(0)

  let pair = Object.values(allChoosePool)?.[index]

  return (
    <Wrapper>
      <PoolInfo
        pair={pair}
        type="stake"
      />

      <Box mt={10}>
        <Button
          variant="primary"
          onClick={() => {
            if (index === allChoosePoolLength - 1) {
            } else {
              const newIndex = index + 1
              setIndex(newIndex)
            }
          }}
        >
          STAKE {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
        </Button>
      </Box>
    </Wrapper>
  )
}
export default Stake

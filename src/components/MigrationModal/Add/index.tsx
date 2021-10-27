import React, { useState } from 'react'
import { Wrapper } from './styleds'
import { Box, Button } from '@pangolindex/components'
import { Pair } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'

export interface UnstackProps {
  allChoosePool: { [address: string]: Pair }
  goNext: () => void
  allChoosePoolLength: number
}

const Add = ({ allChoosePool, goNext, allChoosePoolLength }: UnstackProps) => {
  const [index, setIndex] = useState(0)

  let pair = Object.values(allChoosePool)?.[index]

  return (
    <Wrapper>
      <PoolInfo pair={pair} type="add" />

      <Box mt={10}>
        <Button
          variant="primary"
          onClick={() => {
            if (index === allChoosePoolLength - 1) {
              goNext()
            } else {
              const newIndex = index + 1
              setIndex(newIndex)
            }
          }}
        >
          ADD {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
        </Button>
      </Box>
    </Wrapper>
  )
}
export default Add

import { Box, SarStakeWidget, SarManageWidget, SarNFTPortfolio, Position } from '@pangolindex/components'
import React, { useState } from 'react'
import StakeStat from './StakeStat'
import { PageWrapper } from './styleds'

export default function SarStaking() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const onSelectPosition = (position: Position | null) => {
    setSelectedPosition(position)
  }

  return (
    <PageWrapper>
      <Box style={{ gridArea: 'details' }}>
        <StakeStat />
      </Box>
      <Box style={{ gridArea: 'images' }}>
        <SarNFTPortfolio onSelectPosition={onSelectPosition} />
      </Box>
      <Box style={{ gridArea: 'stake' }} display="flex" flexDirection="column">
        <Box>
          <SarManageWidget selectedPosition={selectedPosition} />
        </Box>
        <Box mt={10} mb={10}>
          <SarStakeWidget />
        </Box>
      </Box>
    </PageWrapper>
  )
}

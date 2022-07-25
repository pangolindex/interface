import { Box } from '@pangolindex/components'
import React from 'react'
import StakeStat from './StakeStat/StakeStat'
import { PageWrapper } from './styleds'

export default function SarStaking() {
  return (
    <PageWrapper>
      <Box className="details" style={{ gridArea: 'details' }}>
        <StakeStat />
      </Box>
      <Box className="images" style={{ gridArea: 'images' }}>
        images
      </Box>
      <Box className="stake" style={{ gridArea: 'stake' }}>
        widget
      </Box>
    </PageWrapper>
  )
}

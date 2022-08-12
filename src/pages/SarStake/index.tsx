import {
  Box,
  SarStakeWidget,
  SarManageWidget,
  SarNFTPortfolio,
  Position,
  existSarContract,
  useTranslation,
  Text
} from '@pangolindex/components'
import React, { useState } from 'react'
import { useChainId } from 'src/hooks'
import StakeStat from './StakeStat'
import { PageWrapper } from './styleds'

export default function SarStaking() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const chainId = useChainId()

  const { t } = useTranslation()

  const onSelectPosition = (position: Position | null) => {
    setSelectedPosition(position)
  }

  if (!existSarContract(chainId)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
        <Text color="text1" textAlign="center" fontWeight={700} fontSize="18px">
          {t('earnPage.noActiveRewards')}
        </Text>
      </Box>
    )
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

import {
  Box,
  SarStakeWidget,
  SarManageWidget,
  SarNFTPortfolio,
  Position,
  existSarContract,
  useTranslation,
  Text,
  useSarPositions,
  Modal,
  Loader
} from '@pangolindex/components'
import React, { useState } from 'react'
import Confetti from 'src/components/Confetti'
import { useChainId } from 'src/hooks'
import useParsedQueryString from 'src/hooks/useParsedQueryString'
import StakeStat from './StakeStat'
import { CloseButton, PageWrapper, StyledSVG } from './styleds'

export default function SarStaking() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const params = useParsedQueryString()
  const chainId = useChainId()

  const { t } = useTranslation()

  const { positions, isLoading } = useSarPositions()

  const onSelectPosition = (position: Position | null) => {
    setSelectedPosition(position)
  }

  const [showClaimed, setShowClaimed] = useState(Boolean(params['showClaimed']))

  const lastPostion = positions && positions.length > 0 ? positions[positions.length - 1] : null

  const onDimiss = () => {
    setShowClaimed(false)
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
      <Box style={{ gridArea: 'stake' }} minWidth="330px" display="flex" flexDirection="column">
        <Box>
          <SarManageWidget selectedPosition={selectedPosition} />
        </Box>
        <Box mt={10} mb={10}>
          <SarStakeWidget />
        </Box>
      </Box>
      <Modal isOpen={showClaimed} onDismiss={onDimiss}>
        <Confetti start={showClaimed} />
        <Box padding="30px" position="relative">
          <CloseButton onClick={onDimiss} />
          {isLoading ? (
            <Loader size={100} />
          ) : (
            <StyledSVG
              dangerouslySetInnerHTML={{
                __html: lastPostion
                  ? Buffer.from(lastPostion.uri.image.replace('data:image/svg+xml;base64,', ''), 'base64').toString()
                  : ''
              }}
            />
          )}
        </Box>
      </Modal>
    </PageWrapper>
  )
}

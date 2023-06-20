import React from 'react'
import { PageWrapper, CenterText, Frame } from './styleds'
import { Text, Box, Airdrop, ComingSoon } from '@pangolindex/components'
import { QuestionAnswer } from './QuestionBox'
import { activeAirdrops, comingSoonAirdrops, specialAirdrops } from 'src/constants/airdrop'

const AirdropUI: React.FC = () => {
  return (
    <PageWrapper>
      <Box paddingBottom="20px">
        <CenterText>
          <Text fontSize={[24, 32]} fontWeight={500} lineHeight="64px">
            Pangolin Going Crosschain
          </Text>
          {(activeAirdrops.length > 0 || specialAirdrops.length > 0) && (
            <Text fontSize={[18, 14]} fontWeight={500} color="text10">
              And we are not empty handed!
            </Text>
          )}
        </CenterText>
      </Box>
      <Frame>
        {activeAirdrops.length === 0 && specialAirdrops.length === 0 && comingSoonAirdrops.length === 0 ? (
          <Text fontWeight={500} fontSize={24} textAlign="center">
            No airdrops active now.
          </Text>
        ) : (
          <>
            {activeAirdrops.map((airdrop, index) => (
              <Airdrop {...airdrop} key={`${index}-${airdrop.contractAddress}`} />
            ))}
            {specialAirdrops.map((airdrop, index) => (
              <Airdrop {...airdrop} key={`${index}-${airdrop.contractAddress}`} />
            ))}
            {comingSoonAirdrops.map((airdrop, index) => (
              <ComingSoon {...airdrop} key={`${index}-${airdrop.token.address}`} />
            ))}
          </>
        )}
      </Frame>
      <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
        <Text fontSize={[32, 24]} fontWeight={500} lineHeight="66px" color="text10">
          HAVE QUESTIONS?
        </Text>
        <QuestionAnswer />
      </Box>
    </PageWrapper>
  )
}

export default AirdropUI

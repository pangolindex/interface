import React from 'react'
import { PageWrapper, MainTitle, CenterText, Frame } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import { QuestionAnswer } from './QuestionBox'
import { Chain, CHAINS } from '@pangolindex/sdk'
import { activeAirdrops, commingSoonAirdrops, AirdropData, specialAirdrops } from 'src/constants/airdrop'
import NotConnected from './NotConnected'
import ChangeChain from './ChangeChain'
import ClaimReward from './ClaimReward'
import CommingSoon from './CommingSoon'

const AirdropUI: React.FC = () => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const renderAirdrop = (chain: Chain, key: number, airdropData: AirdropData) => {
    if (!account) {
      return <NotConnected key={key} chain={chain} title={airdropData?.title} />
    }
    if (chainId !== chain?.chain_id) {
      return <ChangeChain key={key} chain={chain} />
    }
    return <ClaimReward key={key} chain={chain} {...airdropData} />
  }

  return (
    <PageWrapper>
      <Box paddingBottom="20px">
        <CenterText>
          <MainTitle>Pangolin Going Crosschain</MainTitle>
          <Text fontSize={[18, 14]} fontWeight={500} lineHeight="27px" color="text10">
            And we are not empty handed!
          </Text>
        </CenterText>
      </Box>
      <Frame>
        {Object.entries(specialAirdrops).map(([chainId, airdrops], index) => {
          return airdrops
            ?.filter(data => data.active)
            ?.map(data => renderAirdrop((CHAINS as any)[chainId], index, data))
        })}
        {Object.entries(activeAirdrops).map(([chainId, airdrop], index) => {
          if (!!airdrop && airdrop.active) {
            return renderAirdrop((CHAINS as any)[chainId], index, airdrop)
          }
          return null
        })}
        {commingSoonAirdrops.map((chain, index) => (
          <CommingSoon key={index} chain={chain} />
        ))}
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

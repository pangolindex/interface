import React from 'react'
import { PageWrapper, CenterText, Frame } from '../airdrop/styleds'
import { Text, Box, ClosedRegistration } from '@pangolindex/components'
import { CHAINS, ChainId, Token } from '@pangolindex/sdk'
import { QuestionAnswer } from '../QuestionBox'
import { SubCategories } from 'src/state/bridge/hooks'

const HederaAirdropUI: React.FC = () => {
  const PBAR = new Token(
    ChainId.HEDERA_MAINNET,
    CHAINS[ChainId.HEDERA_MAINNET].contracts!.png,
    8,
    CHAINS[ChainId.HEDERA_MAINNET].png_symbol,
    'Pangolin Hedera'
  )

  const data: SubCategories[] = [
    {
      id: 1,
      title: 'How much PBAR is being airdropped?',
      content: '.5% of the total supply, equalling 1,150,000 PBAR',
      subcategory: 'hedera'
    },
    {
      id: 2,
      title: 'Is the airdrop being distributed to users who have ever PNG/PSB/PFL stakers and holders?',
      content:
        'No. The airdrop will be distributed to only to PNG/PSB/PFL stakers and holders who were holding or staking at the time of the snapshot and who register during the registration window.',
      subcategory: 'hedera'
    },
    {
      id: 3,
      title: 'Do PNG/PSB/PFL all count the same?',
      content:
        'No, the PBAR distribution is weighted based on the TVL of the chain. The distribution is 92% to PNG holders/stakers, 6% to PSB, and 2% to PFL.',
      subcategory: 'hedera'
    },
    {
      id: 4,
      title: 'How do I know if I qualify?',
      content:
        'If on June 20th, you either held or staked PNG, PSB, or PFL, you will qualify. The exact blocks for the snapshots were: - Flare: Block 9,918,500 - Songbird: Block 37,030,200 - Avalanche: Block 31,565,000',
      subcategory: 'hedera'
    },
    {
      id: 5,
      title: 'Will I need to claim on Hedera?',
      content:
        'No. If you register in the time window and you qualify, we will automatically send your PBAR to your wallet.',
      subcategory: 'hedera'
    },
    {
      id: 6,
      title: "There's an outstanding airdrop of PFL. What happened to that?",
      content:
        'Once we implement on-chain governance for Pangolin Flare, we will put up a proposal for the airdrop distribution on Flare for PFL. All SAR NFT stakers will have the ability to vote on it.',
      subcategory: 'hedera'
    }
  ]

  return (
    <PageWrapper>
      <Box paddingBottom="20px">
        <CenterText>
          <Text fontSize={[24, 32]} fontWeight={500} lineHeight="64px">
            Hedera Airdrop Registration
          </Text>
          <Text fontSize={[18, 14]} fontWeight={500} color="text10">
            And we are not empty handed!
          </Text>
        </CenterText>
      </Box>
      <Frame>
        <>
          <ClosedRegistration
            token={PBAR}
            logo={
              'https://raw.githubusercontent.com/pangolindex/tokens/main/assets/296/0x000000000000000000000000000000000040B1FA/logo_48.png'
            }
          />
        </>
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <Text fontSize={[32, 24]} fontWeight={500} lineHeight="66px" color="text10">
            HAVE QUESTIONS?
          </Text>
          <QuestionAnswer extraQuestions={data} />
        </Box>
      </Frame>
    </PageWrapper>
  )
}

export default HederaAirdropUI

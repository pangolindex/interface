import React from 'react'
import { PageWrapper, CenterText, Frame } from '../airdrop/styleds'
import { Text, Box, Airdrop, Tokens } from '@pangolindex/components'
import { ChainId, HEDERA_MAINNET } from '@pangolindex/sdk'
import { QuestionAnswer } from '../QuestionBox'
import { getTokenLogoURL } from 'src/constants'
import { AirdropQuestion } from 'src/constants/airdrop'

const { PNG } = Tokens
const hederaAirdrop = {
  contractAddress: HEDERA_MAINNET!.contracts!.airdrop!.address,
  type: HEDERA_MAINNET!.contracts!.airdrop!.type,
  token: PNG[ChainId.HEDERA_MAINNET],
  logo: getTokenLogoURL(PNG[ChainId.HEDERA_MAINNET].address, ChainId.HEDERA_MAINNET, 48)
}

const HederaAirdropUI: React.FC = () => {
  const data: AirdropQuestion[] = [
    {
      title: 'How much PBAR is being airdropped?',
      content: '.5% of the total supply, equalling 1,150,000 PBAR'
    },
    {
      title: 'Is the airdrop being distributed to users who have ever PNG/PSB/PFL stakers and holders?',
      content:
        'No. The airdrop will be distributed to only to PNG/PSB/PFL stakers and holders who were holding or staking at the time of the snapshot and who register during the registration window.'
    },
    {
      title: 'Do PNG/PSB/PFL all count the same?',
      content:
        'No, the PBAR distribution is weighted based on the TVL of the chain. The distribution is 92% to PNG holders/stakers, 6% to PSB, and 2% to PFL.'
    },
    {
      title: 'How do I know if I qualify?',
      content:
        'If on June 20th, you either held or staked PNG, PSB, or PFL, you will qualify. The exact blocks for the snapshots were: - Flare: Block 9,918,500 - Songbird: Block 37,030,200 - Avalanche: Block 31,565,000'
    },
    {
      title: 'Will I need to claim your PBAR on Hedera?',
      content:
        'Yes. If you register in the time window and you qualify, you will need to return here to claim your PBAR after the registration window.'
    },
    {
      title: "There's an outstanding airdrop of PFL. What happened to that?",
      content:
        'Once we implement on-chain governance for Pangolin Flare, we will put up a proposal for the airdrop distribution on Flare for PFL. All SAR NFT stakers will have the ability to vote on it.'
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
          <Airdrop {...hederaAirdrop} />
        </>
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <Text fontSize={[32, 24]} fontWeight={500} lineHeight="66px" color="text10">
            HAVE QUESTIONS?
          </Text>
          <QuestionAnswer questions={data} />
        </Box>
      </Frame>
    </PageWrapper>
  )
}

export default HederaAirdropUI

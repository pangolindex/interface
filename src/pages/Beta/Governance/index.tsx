import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@pangolindex/components'
import { PageWrapper, PageTitle, ContentWrapper, About } from './styleds'
import GovernanceCard from './GovernanceCard'
import Loader from 'src/components/Loader'
import { useAllProposalData, ProposalData } from 'src/state/governance/hooks'
import { proposalStates } from './GovernanceCard'

const GovernanceUI = () => {
  const { t } = useTranslation()

  // get data to list all proposals
  const allProposals: ProposalData[] = useAllProposalData()

  return (
    <PageWrapper>
      <PageTitle>{t('votePage.pangolinGovernance')}</PageTitle>
      <ContentWrapper>
        <About>
          <Text fontSize={28} fontWeight={800} lineHeight="33px" color="text1" style={{ marginBottom: '14px' }}>
            {t('votePage.about')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text1">
            {t('votePage.earnedPngTokens')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text1">
            {t('votePage.eligibleToVote')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text1">
            {t('votePage.governanceVotes')}
          </Text>
        </About>
        {(!allProposals || allProposals.length === 0) && (
          <div style={{ textAlign: 'center', margin: '30px' }}>
            <Loader />
          </div>
        )}
        {allProposals?.map((p: ProposalData) => {
          return (
            <GovernanceCard
              id={p.id}
              title={p.title}
              status={p.status as proposalStates}
              to={'/beta/vote/' + p.id}
              key={p.id}
            />
          )
        })}
      </ContentWrapper>
    </PageWrapper>
  )
}
export default GovernanceUI

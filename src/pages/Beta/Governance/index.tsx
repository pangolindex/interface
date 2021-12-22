import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@pangolindex/components'
import { PageWrapper, PageTitle, ContentWrapper, About } from './styleds'
import GovernanceCard from './GovernanceCard'

// import { useModalOpen, useToggleDelegateModal } from 'src/state/application/hooks'
// import { ApplicationModal } from 'src/state/application/actions'

import { useAllProposalData, ProposalData } from 'src/state/governance/hooks'
// import { useTokenBalance } from 'src/state/wallet/hooks'
// import { useActiveWeb3React } from 'src/hooks'
// import { PNG } from 'src/constants'
// import { TokenAmount } from '@pangolindex/sdk'

const GovernanceUI = () => {
  // const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // toggle for showing delegation modal
  // const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  // const toggleDelegateModal = useToggleDelegateModal()

  // get data to list all proposals
  const allProposals: ProposalData[] = useAllProposalData()

  // user data
  // const availableVotes: TokenAmount | undefined = useUserVotes()
  // const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, chainId ? PNG[chainId] : undefined)
  // const userDelegatee: string | undefined = useUserDelegatee()

  // show delegation option if they have have a balance, but have not delegated
  // const showUnlockVoting = Boolean(
  //   pngBalance && JSBI.notEqual(pngBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  // )

  return (
    <PageWrapper>
      <PageTitle>{t('votePage.pangolinGovernance')}</PageTitle>
      <ContentWrapper>
        <About>
          <Text fontSize={28} fontWeight={800} lineHeight="33px" color="text1" style={{ marginBottom: '14px' }}>
            {t('governancePage.about')}
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
        {allProposals?.map((p: ProposalData) => {
          return (
            <GovernanceCard
              id={p.id}
              title={p.title}
              status={t('governancePage.vote')}
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

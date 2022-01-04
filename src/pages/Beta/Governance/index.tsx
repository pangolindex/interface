import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@pangolindex/components'
import {
  PageWrapper,
  PageTitle,
  ContentWrapper,
  About,
  WrapSmall,
  AddressButton,
  TextButton,
  StyledExternalLink,
  DefaultButton
  // EmptyProposals
} from './styleds'
import GovernanceCard, { ProposalStates } from './GovernanceCard'
import Loader from 'src/components/Loader'

import { useAllProposalData, ProposalData, useUserVotes, useUserDelegatee } from 'src/state/governance/hooks'
import DelegateModal from 'src/components/vote/DelegateModal'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { PNG, ZERO_ADDRESS } from 'src/constants'
import { JSBI, TokenAmount, ChainId } from '@pangolindex/sdk'
import { shortenAddress, getEtherscanLink } from 'src/utils'
import FormattedCurrencyAmount from 'src/components/FormattedCurrencyAmount'

import { TYPE } from 'src/theme'
import { RowBetween, RowFixed } from 'src/components/Row'

import { useModalOpen, useToggleDelegateModal } from 'src/state/application/hooks'
import { ApplicationModal } from 'src/state/application/actions'

const GovernanceUI = () => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // toggle for showing delegation modal
  const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  const toggleDelegateModal = useToggleDelegateModal()

  // get data to list all proposals
  const allProposals: ProposalData[] = useAllProposalData()

  // user data
  const availableVotes: TokenAmount | undefined = useUserVotes()
  const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, chainId ? PNG[chainId] : undefined)
  const userDelegatee: string | undefined = useUserDelegatee()

  // show delegation option if they have have a balance, but have not delegated
  const showUnlockVoting = Boolean(
    pngBalance && JSBI.notEqual(pngBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  )

  return (
    <PageWrapper>
      <DelegateModal
        isOpen={showDelegateModal}
        onDismiss={toggleDelegateModal}
        title={showUnlockVoting ? t('votePage.unlockVotes') : t('votePage.updateDelegation')}
      />
      <PageTitle>{t('votePage.pangolinGovernance')}</PageTitle>
      <ContentWrapper>
        <About>
          <Text fontSize={28} fontWeight={800} lineHeight="33px" color="text10" style={{ marginBottom: '14px' }}>
            {t('votePage.about')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text10">
            {t('votePage.earnedPngTokens')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text10">
            {t('votePage.eligibleToVote')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text10">
            {t('votePage.governanceVotes')}
          </Text>
        </About>
        <WrapSmall style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
          {showUnlockVoting ? (
            <DefaultButton variant="primary" onClick={toggleDelegateModal}>
              {t('votePage.unlockVoting')}
            </DefaultButton>
          ) : availableVotes && JSBI.notEqual(JSBI.BigInt(0), availableVotes?.raw) ? (
            <TYPE.body fontWeight={500} mr="6px">
              <FormattedCurrencyAmount currencyAmount={availableVotes} /> {t('votePage.votes')}
            </TYPE.body>
          ) : pngBalance &&
            userDelegatee &&
            userDelegatee !== ZERO_ADDRESS &&
            JSBI.notEqual(JSBI.BigInt(0), pngBalance?.raw) ? (
            <TYPE.body fontWeight={500} mr="6px">
              <FormattedCurrencyAmount currencyAmount={pngBalance} /> {t('votePage.votes')}
            </TYPE.body>
          ) : (
            ''
          )}
        </WrapSmall>
        {!showUnlockVoting && (
          <RowBetween>
            <div />
            {userDelegatee && userDelegatee !== ZERO_ADDRESS ? (
              <RowFixed>
                <TYPE.body fontWeight={500} mr="4px">
                  {t('votePage.delegatedTo')}
                </TYPE.body>
                <AddressButton>
                  <StyledExternalLink
                    href={getEtherscanLink(ChainId.FUJI, userDelegatee, 'address')}
                    style={{ margin: '0 4px' }}
                  >
                    {userDelegatee === account ? 'Self' : shortenAddress(userDelegatee)}
                  </StyledExternalLink>
                  <TextButton onClick={toggleDelegateModal} style={{ marginLeft: '4px' }}>
                    ({t('votePage.edit')})
                  </TextButton>
                </AddressButton>
              </RowFixed>
            ) : (
              ''
            )}
          </RowBetween>
        )}
        {(!allProposals || allProposals.length === 0) && (
          <div style={{ textAlign: 'center', margin: '30px' }}>
            <Loader />
          </div>
        )}
        {/* {allProposals?.length === 0 && (
          <EmptyProposals>
            <TYPE.body style={{ marginBottom: '8px' }}>{t('votePage.noProposalsFound')}</TYPE.body>
            <TYPE.subHeader>
              <i>{t('votePage.proposalCommunityMembers')}</i>
            </TYPE.subHeader>
          </EmptyProposals>
        )} */}
        {allProposals?.map((p: ProposalData) => {
          return (
            <GovernanceCard
              id={p.id}
              title={p.title}
              status={p.status as ProposalStates}
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

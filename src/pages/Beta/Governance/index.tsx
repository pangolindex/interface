import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Loader, Box, shortenAddress } from '@pangolindex/components'
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
import { useGetProposalsViaSubgraph, ProposalData, useUserVotes, useUserDelegatee } from 'src/state/governance/hooks'
import DelegateModal from 'src/components/vote/DelegateModal'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React, useChain, useChainId, usePngSymbol } from 'src/hooks'
import { BETA_MENU_LINK, ZERO_ADDRESS } from 'src/constants'
import { PNG } from 'src/constants/tokens'
import { JSBI, TokenAmount, ChainId } from '@pangolindex/sdk'
import { getEtherscanLink } from 'src/utils'
import FormattedCurrencyAmount from 'src/components/FormattedCurrencyAmount'
import { TYPE } from 'src/theme'
import { RowBetween, RowFixed } from 'src/components/Row'
import { useModalOpen, useToggleDelegateModal } from 'src/state/application/hooks'
import { ApplicationModal } from 'src/state/application/actions'

const GovernanceUI = () => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const chain = useChain(chainId)
  const { t } = useTranslation()
  const pngSymbol = usePngSymbol()

  // toggle for showing delegation modal
  const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  const toggleDelegateModal = useToggleDelegateModal()

  // get data to list all proposals
  const allProposals: ProposalData[] = useGetProposalsViaSubgraph()

  // user data
  const availableVotes: TokenAmount | undefined = useUserVotes()
  const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, PNG[chainId])
  const userDelegatee: string | undefined = useUserDelegatee()

  // show delegation option if they have have a balance, but have not delegated
  const showUnlockVoting = Boolean(
    pngBalance && JSBI.notEqual(pngBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  )

  function getAddress() {
    if (userDelegatee === account) {
      return 'Self'
    }
    return userDelegatee ? shortenAddress(userDelegatee, chainId) : ''
  }

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
          <Text fontSize={22} fontWeight={800} lineHeight="33px" color="text10" style={{ marginBottom: '14px' }}>
            {t('votePage.about')}
          </Text>
          <Text fontSize={14} lineHeight="24px" color="text10">
            {t('votePage.earnedPngTokens', { pngSymbol: pngSymbol })}
          </Text>
          <Text fontSize={14} lineHeight="24px" color="text10">
            {t('votePage.eligibleToVote', { pngSymbol: pngSymbol })}
          </Text>
          <Text fontSize={14} lineHeight="24px" color="text10">
            {t('votePage.governanceVotes')}
          </Text>
        </About>
        {chain.contracts?.governor ? (
          <>
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
                        {getAddress()}
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
                <Loader size={100} />
              </div>
            )}
            {allProposals?.map((p: ProposalData) => {
              return (
                <GovernanceCard
                  id={p.id}
                  title={p.title}
                  status={p.status as ProposalStates}
                  to={`${BETA_MENU_LINK.vote}/${p.id}`}
                  key={p.id}
                />
              )
            })}
          </>
        ) : (
          <Box width="100%" marginTop={20} display="flex" justifyContent="center">
            <Text color="text1" fontSize={22}>
              {t('votePage.notSupported')}
            </Text>
          </Box>
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}
export default GovernanceUI

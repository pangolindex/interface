import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'
import { TokenAmount, JSBI } from '@pangolindex/sdk'
import { Text, Box, Loader } from '@pangolindex/components'
import {
  PageWrapper,
  CardWrapper,
  ProposalInfo,
  ArrowWrapper,
  StyledDataCard,
  WrapSmall,
  ProgressWrapper,
  Progress,
  DetailText,
  MarkDownWrapper
} from './styleds'
import { ProposalStatus } from 'src/pages/Vote/styled'
import { RowFixed, RowBetween } from 'src/components/Row'
import { AutoColumn } from 'src/components/Column'
import { CardSection } from 'src/components/earn/styled'
import { ButtonPrimary } from 'src/components/Button'
import VoteModal from 'src/components/vote/VoteModal'
import { useGetProposalDetail, useUserVotes, useUserDelegatee, ProposalData } from 'src/state/governance/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { ExternalLink } from 'src/theme'
import { ZERO_ADDRESS } from 'src/constants'
import { PNG } from 'src/constants/tokens'
import { isAddress, getEtherscanLink } from 'src/utils'
import { BETA_MENU_LINK } from 'src/constants'

export interface GovernanceDetailProps {
  id: string
}

export default function GovernanceDetail() {
  const params = useParams<GovernanceDetailProps>()
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // get data for this specific proposal
  const proposalData: ProposalData | undefined = useGetProposalDetail(params.id)

  // update support based on button interactions
  const [support, setSupport] = useState<boolean>(true)

  // modal for casting votes
  const [showModal, setShowModal] = useState<boolean>(false)

  // get and format date from data
  const startTimestamp: number | undefined = proposalData?.startTime
  const endTimestamp: number | undefined = proposalData?.endTime
  const startDate: DateTime | undefined = startTimestamp ? DateTime.fromSeconds(startTimestamp) : undefined
  const endDate: DateTime | undefined = endTimestamp ? DateTime.fromSeconds(endTimestamp) : undefined
  const now: DateTime = DateTime.local()

  // get total votes and format percentages for UI
  const totalVotes: number | undefined = proposalData ? proposalData.forCount + proposalData.againstCount : undefined
  const forPercentage: string =
    proposalData && totalVotes ? ((proposalData.forCount * 100) / totalVotes).toFixed(0) + '%' : '0%'
  const againstPercentage: string =
    proposalData && totalVotes ? ((proposalData.againstCount * 100) / totalVotes).toFixed(0) + '%' : '0%'

  // show delegation option if they have have a balance, have not delegated
  const availableVotes: TokenAmount | undefined = useUserVotes()
  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, chainId ? PNG[chainId] : undefined)
  const userDelegatee: string | undefined = useUserDelegatee()
  const showUnlockVoting = Boolean(
    uniBalance && JSBI.notEqual(uniBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  )

  // show links in propsoal details if content is an address
  const linkIfAddress = (content: string) => {
    if (isAddress(content) && chainId) {
      return <ExternalLink href={getEtherscanLink(chainId, content, 'address')}>{content}</ExternalLink>
    }
    return <span>{content}</span>
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <VoteModal
        isOpen={showModal}
        onDismiss={() => setShowModal(false)}
        proposalId={proposalData?.id}
        support={support}
      />
      <ProposalInfo gap="lg" justify="start">
        <RowBetween style={{ width: '100%' }}>
          <ArrowWrapper to={BETA_MENU_LINK.vote}>
            <ArrowLeft size={20} /> {t('votePage.backToProposals')}
          </ArrowWrapper>
          {proposalData && <ProposalStatus status={proposalData?.status ?? ''}>{proposalData?.status}</ProposalStatus>}
        </RowBetween>
        <AutoColumn gap="10px" style={{ width: '100%' }}>
          <Text fontSize={44} lineHeight="52px" color="text1" style={{ marginBottom: '.5rem' }}>
            {proposalData?.title}
          </Text>

          <RowBetween>
            <Text fontSize={18} color="text1">
              {startDate && startDate <= now
                ? t('votePage.votingStarted') + (startDate && startDate.toLocaleString(DateTime.DATETIME_FULL))
                : proposalData
                ? t('votePage.votingStarts') + (startDate && startDate.toLocaleString(DateTime.DATETIME_FULL))
                : ''}
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize={18} color="text1">
              {endDate && endDate < now
                ? t('votePage.votingEnded') + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
                : proposalData
                ? t('votePage.votingEnds') + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
                : ''}
            </Text>
          </RowBetween>
        </AutoColumn>

        {!showUnlockVoting &&
        availableVotes &&
        JSBI.greaterThan(availableVotes?.raw, JSBI.BigInt(0)) &&
        endDate &&
        endDate > now &&
        startDate &&
        startDate <= now ? (
          <RowFixed style={{ width: '100%', gap: '12px' }}>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              onClick={() => {
                setSupport(true)
                setShowModal(true)
              }}
            >
              {t('votePage.voteFor')}
            </ButtonPrimary>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              onClick={() => {
                setSupport(false)
                setShowModal(true)
              }}
            >
              {t('votePage.voteAgainst')}
            </ButtonPrimary>
          </RowFixed>
        ) : (
          ''
        )}
        <CardWrapper>
          <StyledDataCard>
            <CardSection>
              <AutoColumn gap="md">
                <WrapSmall>
                  <Text fontWeight={500} fontSize={16} lineHeight="24px" color="text1">
                    {t('votePage.for')}
                  </Text>
                  <Text fontWeight={500} fontSize={16} lineHeight="24px" color="text11">
                    {proposalData?.forCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                </WrapSmall>
              </AutoColumn>
              <ProgressWrapper>
                <Progress status={'for'} percentageString={forPercentage} />
              </ProgressWrapper>
            </CardSection>
          </StyledDataCard>
          <StyledDataCard>
            <CardSection>
              <AutoColumn gap="md">
                <WrapSmall>
                  <Text fontWeight={500} fontSize={16} lineHeight="24px" color="text1">
                    {t('votePage.against')}
                  </Text>
                  <Text fontWeight={500} fontSize={16} lineHeight="24px" color="text12">
                    {proposalData?.againstCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                </WrapSmall>
              </AutoColumn>
              <ProgressWrapper>
                <Progress status={'against'} percentageString={againstPercentage} />
              </ProgressWrapper>
            </CardSection>
          </StyledDataCard>
        </CardWrapper>
        <StyledDataCard style={{ borderRadius: '0px' }}>
          <CardSection style={{ padding: '25px 30px', display: 'block' }}>
            <AutoColumn gap="md">
              <Text fontWeight={800} fontSize={28} lineHeight="33px" color="text1">
                {t('votePage.details')}
              </Text>
              {proposalData?.details?.map((d, i) => {
                return (
                  <DetailText key={i}>
                    {i + 1}: {linkIfAddress(d.target)}.{d.functionSig}(
                    {d.callData.split(',').map((content, i) => {
                      return (
                        <span key={i}>
                          {linkIfAddress(content)}
                          {d.callData.split(',').length - 1 === i ? '' : ','}
                        </span>
                      )
                    })}
                    )
                  </DetailText>
                )
              })}
            </AutoColumn>
            <AutoColumn gap="md" style={{ marginTop: '30px' }}>
              {proposalData?.description ? (
                <>
                  <Text fontWeight={800} fontSize={28} lineHeight="33px" color="text1">
                    {t('votePage.overview')}
                  </Text>
                  <MarkDownWrapper>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposalData?.description}</ReactMarkdown>
                  </MarkDownWrapper>
                </>
              ) : (
                <Loader size={100} />
              )}
            </AutoColumn>
            <Box style={{ wordWrap: 'break-word' }}>
              {proposalData?.proposer && (
                <>
                  <Text fontWeight={800} fontSize={28} lineHeight="33px" color="text1">
                    {t('votePage.proposer')}
                  </Text>
                  <ExternalLink
                    href={
                      proposalData?.proposer && chainId
                        ? getEtherscanLink(chainId, proposalData?.proposer, 'address')
                        : ''
                    }
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposalData?.proposer}</ReactMarkdown>
                  </ExternalLink>
                </>
              )}
            </Box>
          </CardSection>
        </StyledDataCard>
      </ProposalInfo>
    </PageWrapper>
  )
}

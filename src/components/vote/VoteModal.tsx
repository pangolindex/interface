import React, { useState, useContext } from 'react'
import { useChainId } from '../../hooks'

import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CustomLightSpinner } from '../../theme'
import { X, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import Circle from '../../assets/svg/blue-loader.svg'
import { useVoteCallback, useUserVotes } from '../../state/governance/hooks'
import { ExternalLink } from '../../theme/components'
import { TokenAmount } from '@pangolindex/sdk'
import { useTranslation, getEtherscanLink } from '@pangolindex/components'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

interface VoteModalProps {
  isOpen: boolean
  onDismiss: () => void
  support: boolean // if user is for or against proposal
  proposalId: string | undefined // id for the proposal to vote on
}

export default function VoteModal({ isOpen, onDismiss, proposalId, support }: VoteModalProps) {
  const chainId = useChainId()
  const {
    voteCallback
  }: {
    voteCallback: (proposalId: string | undefined, support: boolean) => Promise<string> | undefined
  } = useVoteCallback()
  const availableVotes: TokenAmount | undefined = useUserVotes()

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState<boolean>(false)

  // get theme for colors
  const theme = useContext(ThemeContext)

  const { t } = useTranslation()

  // wrapper to reset state on modal close
  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  async function onVote() {
    setAttempting(true)

    // if callback not returned properly ignore
    if (!voteCallback) return

    // try delegation and store hash
    const _hash = await voteCallback(proposalId, support)?.catch(error => {
      setAttempting(false)
      console.log(error)
    })

    if (_hash) {
      setHash(_hash)
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg" justify="center">
            <RowBetween>
              <TYPE.mediumHeader fontWeight={500}>
                {t('vote.vote')} {support ? t('vote.for') : t('vote.against')} {t('vote.proposal')} {proposalId}
              </TYPE.mediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOndismiss} />
            </RowBetween>
            <TYPE.largeHeader>
              {availableVotes?.toSignificant(4)} {t('vote.votes')}
            </TYPE.largeHeader>
            <ButtonPrimary onClick={onVote}>
              <TYPE.mediumHeader color="white">
                {t('vote.vote')} {support ? t('vote.for') : t('vote.against')} {t('vote.proposal')} {proposalId}
              </TYPE.mediumHeader>
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>{t('vote.submittingVote')} </TYPE.largeHeader>
            </AutoColumn>
            <TYPE.subHeader>{t('vote.confirmTransaction')}</TYPE.subHeader>
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
      {hash && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>{t('vote.transactionSubmitted')}</TYPE.largeHeader>
            </AutoColumn>
            {chainId && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
                <TYPE.subHeader>{t('vote.viewExplorer')}</TYPE.subHeader>
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}

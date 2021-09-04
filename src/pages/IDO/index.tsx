import { Button } from 'rebass/styled-components'
import { darken } from 'polished'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
//import { useAllProposalData, ProposalData, useUserVotes, useUserDelegatee } from '../../state/governance/hooks'
//import { useAllProposalData, ProposalData, useUserDelegatee } from '../../state/governance/hooks'
//import DelegateModal from '../../components/vote/DelegateModal'
//import { useTokenBalance } from '../../state/wallet/hooks'
//import { useActiveWeb3React } from '../../hooks'
//import { PNG, ZERO_ADDRESS } from '../../constants'
//import { JSBI, TokenAmount, ChainId } from '@pangolindex/sdk'
//import { JSBI, TokenAmount} from '@pangolindex/sdk'
//import { shortenAddress, getEtherscanLink } from '../../utils'
//import Loader from '../../components/Loader'   // Will use when we actually fetch IDOs
//import FormattedCurrencyAmount from '../../components/FormattedCurrencyAmount'


//import avalaunchIcon from '../../assets/images/avalaunch-icon.png'
import yaygamesIcon from '../../assets/images/yaygames-icon.png'
//import penguinFiIcon from '../../assets/images/penguinfi-icon.png'
import boofinanceIcon from '../../assets/images/boofinance-icon.jpeg'
//import boofinanceLogo from '../../assets/images/boofinance-logo.png'
//import avalaunchLogo from '../../assets/images/avalaunch-logo1.png'
//import penguinFiLogo from '../../assets/images/penguinfinance-logo.png'
//import poolzLogo from '../../assets/images/poolz-logo.png'
//import starterLogo from '../../assets/images/starter-logo.png'


import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
//import { TYPE, ExternalLink } from '../../theme'
import { TYPE } from '../../theme'
//import { RowBetween, RowFixed } from '../../components/Row'
import { RowBetween } from '../../components/Row'
import { Link } from 'react-router-dom'
import { ProposalStatus } from './styled'
//import { ButtonPrimary } from '../../components/Button'

//import { useModalOpen, useToggleDelegateModal } from '../../state/application/hooks'
//import { ApplicationModal } from '../../state/application/actions'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const Proposal = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
`

/*
const ProposalNumber = styled.span`
  opacity: 0.6;
`
*/
const ProposalTitle = styled.span`
  font-weight: 600;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;

  `};
`

/* the idea is to format the partner logos with this one */
const PngIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`





/*
const TextButton = styled(TYPE.main)`
  color: ${({ theme }) => theme.primary1};
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const AddressButton = styled.div`
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 2px 4px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledExternalLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.text1};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
*/
export default function IDO() {
  //const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // toggle for showing delegation modal
  //const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  //const toggleDelegateModal = useToggleDelegateModal()

  // get data to list all proposals
  //const allProposals: ProposalData[] = useAllProposalData()

  // user data
  //const availableVotes: TokenAmount | undefined = useUserVotes()
  //const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, chainId ? PNG[chainId] : undefined)
  //const userDelegatee: string | undefined = useUserDelegatee()

  // show delegation option if they have have a balance, but have not delegated
  //const showUnlockVoting = Boolean(
  //  pngBalance && JSBI.notEqual(pngBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  //)

  return (
    <PageWrapper gap="lg" justify="center">
      {/*
      <DelegateModal
        isOpen={showDelegateModal}
        onDismiss={toggleDelegateModal}
        title={showUnlockVoting ? t('votePage.unlockVotes') : t('votePage.updateDelegation')}
      />
      */}
      {/* This is the top section of the page */} 
      <TopSection gap="md">
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('IDOPage.pangolinIDOs')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('IDOPage.pangolinIDODescription')}</TYPE.white>
              </RowBetween>
              <RowBetween>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
        
        {/*}
        <AutoRow>
          <PngIcon>
              
          </PngIcon>
        </AutoRow>
        <AutoRow>
          <PngIcon>
              <img  src={poolzLogo} alt="logo" />
          </PngIcon>
        </AutoRow>
        <AutoRow>
          <PngIcon>
              <img  src={starterLogo} alt="logo" />
          </PngIcon>
        </AutoRow>
        */}
      </TopSection>
      {/* TO_DO - Here we display our IDO partners 

      <ul style="display: grid, grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)), grid-gap: 1rem">
          <li class="brands__item">
            <a href="#">
              <img  src={avalaunchLogo} alt="logo" />
            </a>
          </li>
          <li class="brands__item">
            <a href="#">
              <img  src={penguinFiLogo} alt="logo" />
            </a>
          </li>
          <li class="brands__item">
            <a href="#">
              <img  src={poolzLogo} alt="logo" />
            </a>
          </li>
          <li class="brands__item">
            <a href="#">
              <img  src={starterLogo} alt="logo" />
            </a>
          </li>

        </ul>
      */ }
      <TopSection gap="2px">
        <WrapSmall> {/* This is the title section of the IDO list */}
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>
            {t('IDOPage.idos')}
          </TYPE.mediumHeader> {/* 
          {(!allProposals || allProposals.length === 0) && !availableVotes && <Loader />}
          {showUnlockVoting ? (
            <ButtonPrimary
              style={{ width: 'fit-content' }}
              padding="8px"
              borderRadius="8px"
              onClick={toggleDelegateModal}
            >
              {t('votePage.unlockVoting')}
            </ButtonPrimary>
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
          )} */}
        </WrapSmall>
        {/* I don't think we need this section
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
        */}

        {/* This is the piece displayed when no IDOs were found 
        {allProposals?.length === 0 && (
          <EmptyProposals>
            <TYPE.body style={{ marginBottom: '8px' }}>{t('IDOPage.noIDOsFound')}</TYPE.body>
            <TYPE.subHeader>
              <i>{t('IDOPage.IDOAnnounced')}</i>
            </TYPE.subHeader>
          </EmptyProposals>
        )} */}
        
        {/* This is the primary IDO list. Here, it seems pages are built dynamically*/}
        {/*
        {allProposals?.map((p: ProposalData, i) => {
          return (
            <Proposal as={Link} to={'/vote/' + p.id} key={i}>
              <ProposalNumber>{p.id}</ProposalNumber>
              <ProposalTitle>{p.title}</ProposalTitle>
              <ProposalStatus status={p.status}>{p.status}</ProposalStatus>
            </Proposal>
          )
        })}
        */}
        {
          <Proposal as={Link} to={'IDO/1'} key={1}>
            <PngIcon>
              <img width={'50px'} src={boofinanceIcon} alt="logo" />
            </PngIcon>
            <ProposalTitle>Boo Finance by PenguinFinance</ProposalTitle>
            <ProposalStatus status="upcoming">Upcoming</ProposalStatus>
          </Proposal> 
        }
        {
          <Proposal as={Link} to={'IDO/2'} key={2}>
            <PngIcon>
              <img width={'50px'} src={yaygamesIcon} alt="logo" />
            </PngIcon>
            <ProposalTitle>YAY Protocol by Avalaunch</ProposalTitle>
            <ProposalStatus status="upcoming">Upcoming</ProposalStatus>
          </Proposal> 
        }
      </TopSection>
      {/*
      <TYPE.subHeader color="text3">{t('votePage.minimumThreshold')}</TYPE.subHeader>
      */}
    </PageWrapper>
  )
}

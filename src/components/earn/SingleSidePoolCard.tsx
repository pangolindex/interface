import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'
import { SingleSideStaking, SingleSideStakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break } from './styled'
import { useTranslation } from 'react-i18next'
import CurrencyLogo from '../CurrencyLogo'
import { JSBI } from '@antiyro/sdk'
import { useChainId } from 'src/hooks'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const AprContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
     0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     grid-template-columns: 24px 1fr 96px;
   `};
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

export default function SingleSidePoolCard({
  stakingInfo,
  version
}: {
  stakingInfo: SingleSideStakingInfo
  migration?: SingleSideStaking
  version: string
}) {
  const { t } = useTranslation()
  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const backgroundColor = useColor(stakingInfo.rewardToken)
  const chainId = useChainId()

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <TopSection>
        {chainId && <CurrencyLogo currency={stakingInfo.rewardToken} chainId={chainId} />}
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
          Earn {stakingInfo.rewardToken.symbol}
        </TYPE.white>

        {(isStaking || !stakingInfo.isPeriodFinished) && (
          <StyledInternalLink
            to={`/stake/${version}/${currencyId(stakingInfo.rewardToken, chainId)}`}
            style={{ width: '100%' }}
          >
            <ButtonPrimary padding="8px" borderRadius="8px">
              {isStaking ? t('earn.manage') : t('earn.deposit')}
            </ButtonPrimary>
          </StyledInternalLink>
        )}
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white> {t('earn.totalStaked')}</TYPE.white>
          <TYPE.white>
            {`${stakingInfo.totalStakedInPng.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`}
          </TYPE.white>
        </RowBetween>
      </StatContainer>
      <AprContainer>
        <RowBetween>
          <TYPE.white>APR</TYPE.white>
          <TYPE.white>
            {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '}
          </TYPE.white>
        </RowBetween>
      </AprContainer>

      {isStaking && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>{t('earn.yourRate')}</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {`${stakingInfo.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' })} ${
                stakingInfo.rewardToken.symbol
              } / week`}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )
}

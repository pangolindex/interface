import React from 'react'
import { AutoColumn } from '../../../components/Column'
import styled from 'styled-components'
import { JSBI, Currency, TokenAmount } from '@pangolindex/sdk'
import { TYPE } from '../../../theme'
import { RowBetween } from '../../../components/Row'
import { DataCard, CardNoise, CardBGImage } from '../../../components/earn/styled'
import { ButtonEmpty } from '../../../components/Button'
import { CountUp } from 'use-count-up'
import usePrevious from '../../../hooks/usePrevious'
import { BIG_INT_ZERO } from '../../../constants'
import { useTranslation } from 'react-i18next'

const StyledBottomCard = styled(DataCard)<{ dim: any; isOverlay: boolean }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: ${({ isOverlay }) => (isOverlay ? '-40px' : '-24px')};
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

export interface ManageProps {
  stakedAmount: TokenAmount
  earnedAmount: TokenAmount
  weeklyRewardRate?: TokenAmount | undefined
  currency?: Currency | null | undefined
  setShowClaimRewardModal: () => void
  isOverlay: boolean
  isSuperFarm?: boolean
}

const RewardCard: React.FC<ManageProps> = ({
  stakedAmount,
  earnedAmount,
  weeklyRewardRate,
  currency,
  setShowClaimRewardModal,
  isOverlay,
  isSuperFarm = true
}) => {
  const countUpAmount = earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const { t } = useTranslation()

  return (
    <StyledBottomCard dim={stakedAmount?.equalTo(BIG_INT_ZERO)} isOverlay={isOverlay}>
      <CardBGImage desaturate />
      <CardNoise />
      <AutoColumn gap="sm">
        <RowBetween>
          <div>
            <TYPE.black>{t('earnPage.unclaimedReward', { symbol: currency ? currency?.symbol : 'PNG' })}</TYPE.black>
          </div>
          {!isSuperFarm && earnedAmount && JSBI.notEqual(BIG_INT_ZERO, earnedAmount?.raw) && (
            <ButtonEmpty padding="8px" borderRadius="8px" width="fit-content" onClick={() => setShowClaimRewardModal()}>
              {t('earnPage.claim')}
            </ButtonEmpty>
          )}
        </RowBetween>
        <RowBetween style={{ alignItems: 'baseline' }}>
          <TYPE.largeHeader fontSize={36} fontWeight={600}>
            <CountUp
              key={countUpAmount}
              isCounting
              decimalPlaces={4}
              start={parseFloat(countUpAmountPrevious)}
              end={parseFloat(countUpAmount)}
              thousandsSeparator={','}
              duration={1}
            />
          </TYPE.largeHeader>
          <TYPE.black fontSize={16} fontWeight={500}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px ' }}>
              ⚡
            </span>
            {weeklyRewardRate?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}
            {t('earnPage.rewardPerWeek', { symbol: currency ? currency?.symbol : 'PNG' })}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </StyledBottomCard>
  )
}

export default RewardCard

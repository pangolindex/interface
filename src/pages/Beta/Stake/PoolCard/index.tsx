import React from 'react'
import { Text } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import numeral from 'numeral'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, Stats, CardStats, TokenName, DetailButton, StakeButton } from './styleds'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import CurrencyLogo from 'src/components/CurrencyLogo'

export interface PoolCardProps {
  stakingInfo: SingleSideStakingInfo
  onViewDetailsClick: () => void
  onClaimClick: () => void
  onDepositClick: () => void
}

const PoolCard = ({ stakingInfo, onViewDetailsClick, onClaimClick, onDepositClick }: PoolCardProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const showClaimButton = stakingInfo?.earnedAmount?.greaterThan('0')

  return (
    <Card>
      <CardHeader>
        <TokenName>{t('stakePage.earn', { symbol: stakingInfo.rewardToken.symbol })}</TokenName>
        <div>
          <CurrencyLogo size="58px" currency={stakingInfo.rewardToken} />
        </div>
      </CardHeader>
      <CardStats>
        {stakingInfo.stakedAmount.greaterThan('0') ? (
          <Stats>
            <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
              Your staked
            </Text>
            <Text fontSize={28} fontWeight={500} lineHeight="47px" color="text1">
              {numeral(Number(stakingInfo.stakedAmount.toExact())?.toFixed(2)).format('0.00a')} PNG
            </Text>
          </Stats>
        ) : (
          <Stats>
            <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
              {t('stakePage.totalStaked')}
            </Text>
            <Text fontSize={28} fontWeight={500} lineHeight="47px" color="text1">
              {numeral(Number(stakingInfo.totalStakedInPng.toExact())?.toFixed(2)).format('0.00a')} PNG
            </Text>
          </Stats>
        )}
        <Stats>
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            APR
          </Text>
          <Text fontSize={28} fontWeight={500} lineHeight="47px" color="text1">
            {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '}
          </Text>
        </Stats>
      </CardStats>
      <CardStats>
        <DetailButton variant="outline" onClick={onViewDetailsClick}>
          {t('stakePage.seeDetails')}
        </DetailButton>
        {!!account && (
          <>
            {showClaimButton ? (
              <StakeButton variant="primary" onClick={onClaimClick}>
                {t('earnPage.claim')}
              </StakeButton>
            ) : (
              <StakeButton variant="primary" onClick={onDepositClick}>
                {t('earnPage.stake')}
              </StakeButton>
            )}
          </>
        )}
      </CardStats>
    </Card>
  )
}
export default PoolCard

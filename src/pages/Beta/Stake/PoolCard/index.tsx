import React from 'react'
import { Text } from '@pangolindex/components'
import { JSBI } from '@antiyro/sdk'
import numeral from 'numeral'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, Stats, CardStats, TokenName, DetailButton, StakeButton, StatValue } from './styleds'
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
  const { account, chainId } = useActiveWeb3React()

  const showClaimButton = stakingInfo?.earnedAmount?.greaterThan('0')

  return (
    <Card>
      <CardHeader>
        <TokenName>{t('stakePage.earn', { symbol: stakingInfo.rewardToken.symbol })}</TokenName>
        <div>
          {chainId && <CurrencyLogo size="58px" currency={stakingInfo.rewardToken} chainId={chainId} />}
        </div>
      </CardHeader>
      <CardStats>
        {stakingInfo.stakedAmount.greaterThan('0') ? (
          <Stats>
            <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
              Your staked
            </Text>
            <StatValue color="text1">
              {numeral(Number(stakingInfo.stakedAmount.toExact())?.toFixed(2)).format('0.00a')} PNG
            </StatValue>
          </Stats>
        ) : (
          <Stats>
            <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
              {t('stakePage.totalStaked')}
            </Text>
            <StatValue color="text1">
              {numeral(Number(stakingInfo.totalStakedInPng.toExact())?.toFixed(2)).format('0.00a')} PNG
            </StatValue>
          </Stats>
        )}
        <Stats>
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            APR
          </Text>
          <StatValue color="text1">
            {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '}
          </StatValue>
        </Stats>
      </CardStats>
      <CardStats>
        <DetailButton variant="outline" color="color4" backgroundColor="color2" onClick={onViewDetailsClick}>
          {t('stakePage.seeDetails')}
        </DetailButton>
        {!!account && (
          <>
            {showClaimButton ? (
              <StakeButton variant="primary" color="color4" onClick={onClaimClick}>
                {t('earnPage.claim')}
              </StakeButton>
            ) : (
              <StakeButton variant="primary" color="color4" onClick={onDepositClick}>
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

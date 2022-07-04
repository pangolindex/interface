import React, { useState } from 'react'
import { Text, CurrencyLogo } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import numeral from 'numeral'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, Stats, CardStats, TokenName, DetailButton, StakeButton, StatValue } from './styleds'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import ClaimDrawer from '../ClaimDrawer'
import StakeDrawer from './StakeDrawer'

export interface PoolCardProps {
  stakingInfo: SingleSideStakingInfo
  onViewDetailsClick: () => void
}

const PoolCard = ({ stakingInfo, onViewDetailsClick }: PoolCardProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false)

  const [isStakeDrawerVisible, setShowtakeDrawer] = useState(false)

  const showClaimButton = stakingInfo?.earnedAmount?.greaterThan('0')

  return (
    <Card>
      <CardHeader>
        <TokenName>{t('stakePage.earn', { symbol: stakingInfo.rewardToken.symbol })}</TokenName>
        <div>
          <CurrencyLogo size={48} currency={stakingInfo.rewardToken} imageSize={48} />
        </div>
      </CardHeader>
      <CardStats>
        {stakingInfo.stakedAmount.greaterThan('0') ? (
          <Stats>
            <Text fontSize={[16, 12]} fontWeight={500} lineHeight="19px" color="text1">
              Your staked
            </Text>
            <StatValue color="text1">
              {numeral(Number(stakingInfo.stakedAmount.toExact())?.toFixed(2)).format('0.00a')} PNG
            </StatValue>
          </Stats>
        ) : (
          <Stats>
            <Text fontSize={[16, 12]} fontWeight={500} lineHeight="19px" color="text1">
              {t('stakePage.totalStaked')}
            </Text>
            <StatValue color="text1">
              {numeral(Number(stakingInfo.totalStakedInPng.toExact())?.toFixed(2)).format('0.00a')} PNG
            </StatValue>
          </Stats>
        )}
        <Stats>
          <Text fontSize={[16, 12]} fontWeight={500} lineHeight="19px" color="text1">
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
              <StakeButton
                variant="primary"
                // color="color4"
                onClick={() => {
                  setShowClaimDrawer(true)
                }}
              >
                {t('earnPage.claim')}
              </StakeButton>
            ) : (
              <StakeButton
                variant="primary"
                // color="color4"
                onClick={() => {
                  setShowtakeDrawer(true)
                }}
              >
                {t('earnPage.stake')}
              </StakeButton>
            )}
          </>
        )}
      </CardStats>

      <ClaimDrawer
        isOpen={isClaimDrawerVisible}
        onClose={() => {
          setShowClaimDrawer(false)
        }}
        stakingInfo={stakingInfo}
      />

      <StakeDrawer isOpen={isStakeDrawerVisible} onClose={() => setShowtakeDrawer(false)} stakingInfo={stakingInfo} />
    </Card>
  )
}
export default PoolCard

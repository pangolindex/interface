import React from 'react'
import { Text } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardStats, CardButtons, TokenName, DetailButton, StakeButton } from './styleds'
import { SingleSideStaking, SingleSideStakingInfo } from 'src/state/stake/hooks'
import CurrencyLogo from 'src/components/CurrencyLogo'

export interface PoolCardProps {
  stakingInfo: SingleSideStakingInfo
  migration?: SingleSideStaking
  version: string
}

const PoolCard = ({ stakingInfo, version }: PoolCardProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <TokenName>{t('stakePage.earn', { symbol: stakingInfo.rewardToken.symbol })}</TokenName>
        <div>
          <CurrencyLogo size="58px" currency={stakingInfo.rewardToken} />
        </div>
      </CardHeader>
      <CardStats>
        <div>
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            {t('stakePage.totalStaked')}
          </Text>
          <Text fontSize={31} fontWeight={500} lineHeight="47px" color="text1">
            {`${stakingInfo.totalStakedInPng.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`}
          </Text>
        </div>
        <div>
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            {t('stakePage.apr')}
          </Text>
          <Text fontSize={31} fontWeight={500} lineHeight="47px" color="text1">
            {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '}
          </Text>
        </div>
      </CardStats>
      <CardButtons>
        <DetailButton variant="outline"> {t('stakePage.seeDetails')}</DetailButton>
        <StakeButton variant="primary"> {t('stakePage.stake')}</StakeButton>
      </CardButtons>
    </Card>
  )
}
export default PoolCard

import React from 'react'
import { Text } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardColumn, CardStats, CardButtons, TokenName, DetailButton, StakeButton } from './styleds'
import { SingleSideStaking, SingleSideStakingInfo } from 'src/state/stake/hooks'
import CurrencyLogo from 'src/components/CurrencyLogo'
import { StyledInternalLink } from 'src/theme'
import { currencyId } from 'src/utils/currencyId'

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
        <CardColumn width="40%">
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            {t('stakePage.totalStaked')}
          </Text>
          <Text fontSize={31} fontWeight={500} lineHeight="47px" color="text1">
            {`${stakingInfo.totalStakedInPng.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`}
          </Text>
        </CardColumn>
        <CardColumn>
          <Text fontSize={16} fontWeight={500} lineHeight="19px" color="text1">
            {t('stakePage.apr')}
          </Text>
          <Text fontSize={31} fontWeight={500} lineHeight="47px" color="text1">
            {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '}
          </Text>
        </CardColumn>
      </CardStats>
      <CardButtons>
        <DetailButton variant="outline"> {t('stakePage.seeDetails')}</DetailButton>
        <StyledInternalLink
          to={`${version}/${currencyId(stakingInfo.rewardToken)}`}
          style={{ width: '100%', textDecoration: 'none' }}
        >
          <StakeButton variant="primary"> {t('stakePage.stake')}</StakeButton>
        </StyledInternalLink>
      </CardButtons>
    </Card>
  )
}
export default PoolCard

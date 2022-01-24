import React from 'react'
import { Fraction } from '@pangolindex/sdk'
import { Panel, OptionButton, OptionsWrapper, Divider, ActionButon, InnerWrapper, DetailButton } from './styleds'
import Stat from 'src/components/Stat'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { StakingInfo } from 'src/state/stake/hooks'

export interface PoolCardProps {
  stakingInfo: StakingInfo
  onClickViewDetail: () => void
  onClickAddLiquidity: () => void
}

const PoolCard = ({ stakingInfo, onClickViewDetail, onClickAddLiquidity }: PoolCardProps) => {
  const { t } = useTranslation()

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  let yourStackedInUsd = stakingInfo?.totalStakedInUsd
    .multiply(stakingInfo?.stakedAmount)
    .divide(stakingInfo?.totalStakedAmount)

  return (
    <Panel>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {currency0.symbol}-{currency1.symbol}
          </Text>
          <OptionsWrapper>
            <OptionButton active={true}>{stakingInfo?.multiplier ? `${stakingInfo?.multiplier}X` : '-'}</OptionButton>
          </OptionsWrapper>
        </Box>

        <DoubleCurrencyLogo size={55} currency0={currency0} currency1={currency1} />
      </Box>
      <Divider />

      <InnerWrapper>
        {isStaking ? (
          <Stat
            title={t('pool.yourLockedValue')}
            stat={numeral((yourStackedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
          />
        ) : (
          <Stat
            title={t('pool.totalLockedValue')}
            stat={numeral((stakingInfo?.totalStakedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
          />
        )}

        <Stat
          title={`APR`}
          stat={stakingInfo?.combinedApr ? `${stakingInfo?.combinedApr}%` : '-'}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
        />
      </InnerWrapper>

      <InnerWrapper>
        <Box>
          <DetailButton variant="plain" onClick={() => onClickViewDetail()} color="text1" height="45px">
            {t('pool.seeDetails')}
          </DetailButton>
        </Box>
        <Box>
          {isStaking ? (
            <ActionButon variant="plain" onClick={() => {}} backgroundColor="bg2" color="text1" height="45px">
              {t('earnPage.claim')}
            </ActionButon>
          ) : (
            <ActionButon
              variant="plain"
              onClick={() => onClickAddLiquidity()}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('pool.addLiquidity')}
            </ActionButon>
          )}
        </Box>
      </InnerWrapper>
    </Panel>
  )
}

export default PoolCard

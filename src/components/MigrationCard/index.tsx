import React from 'react'
import { Pair, Fraction } from '@pangolindex/sdk'
import { Panel, OptionButton, OptionsWrapper, Divider, MigrateButton, InnerWrapper } from './styleds'
import Stat from '../Stat'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { AutoRow } from '../Row'
import { useTranslation } from 'react-i18next'
import { useGetPairDataFromPair } from '../../state/stake/hooks'
import numeral from 'numeral'
import { StakingInfo } from '../../state/stake/hooks'

export interface StatProps {
  pair: Pair
  stakingData: StakingInfo
  onClickMigrate: () => void
}

const MigrationCard = ({ pair, onClickMigrate, stakingData }: StatProps) => {
  const { t } = useTranslation()

  const { currency0, currency1 } = useGetPairDataFromPair(pair)

  const totalLiqAmount = stakingData?.stakedAmount

  return (
    <Panel>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {currency0.symbol}-{currency1.symbol}
          </Text>
          <OptionsWrapper>
            <OptionButton active={true}>{stakingData?.multiplier ? `${stakingData?.multiplier}X` : '-'}</OptionButton>
          </OptionsWrapper>
        </Box>

        <DoubleCurrencyLogo size={55} currency0={currency0} currency1={currency1} />
      </Box>
      <Divider />

      <AutoRow gap="20px">
        <Stat
          title={t('earnPage.totalStaked')}
          stat={numeral((stakingData?.totalStakedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}
          titlePosition="top"
        />
        <Stat
          title={t('migratePage.apr')}
          stat={stakingData?.combinedApr ? `${stakingData?.combinedApr}%` : '-'}
          titlePosition="top"
        />
      </AutoRow>

      <InnerWrapper>
        <Box>
          <Stat
            title={t('migratePage.readyToMigrate')}
            stat={`${totalLiqAmount ? totalLiqAmount.toSignificant(6) : '-'} PGL`}
            titlePosition="bottom"
          />
        </Box>
        <Box>
          <MigrateButton
            variant="primary"
            onClick={() => {
              onClickMigrate()
            }}
          >
            {t('migratePage.migrateNow')}
          </MigrateButton>
        </Box>
      </InnerWrapper>
    </Panel>
  )
}

export default MigrationCard

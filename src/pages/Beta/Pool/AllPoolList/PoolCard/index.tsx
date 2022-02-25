import React from 'react'
import { Fraction } from '@pangolindex/sdk'
import {
  Panel,
  Divider,
  ActionButon,
  InnerWrapper,
  DetailButton,
  StatWrapper,
  OptionsWrapper,
  OptionButton
} from './styleds'
import Stat from 'src/components/Stat'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { StakingInfo } from 'src/state/stake/hooks'
import { usePair } from 'src/data/Reserves'
import { useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { useTokens } from 'src/hooks/Tokens'
import RewardTokens from 'src/components/RewardTokens'

export interface PoolCardProps {
  stakingInfo: StakingInfo
  onClickViewDetail: () => void
  onClickAddLiquidity: () => void
  onClickClaim: () => void
  onClickStake: () => void
}

const PoolCard = ({
  stakingInfo,
  onClickViewDetail,
  onClickAddLiquidity,
  onClickClaim,
  onClickStake
}: PoolCardProps) => {
  const { t } = useTranslation()

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const [, stakingTokenPair] = usePair(token0, token1)

  const rewardTokens = useTokens(stakingInfo?.rewardTokensAddress)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const yourStackedInUsd = stakingInfo?.totalStakedInUsd
    .multiply(stakingInfo?.stakedAmount)
    .divide(stakingInfo?.totalStakedAmount)

  const { userPgl } = useGetPoolDollerWorth(stakingTokenPair)

  const isLiquidity = Boolean(userPgl?.greaterThan('0'))

  const isSuperFarm = (stakingInfo?.rewardTokensAddress || [])?.length > 0

  return (
    <Panel>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {currency0.symbol}-{currency1.symbol}
          </Text>

          {isSuperFarm && (
            <OptionsWrapper>
              <OptionButton>Super farm</OptionButton>
            </OptionsWrapper>
          )}
        </Box>

        <DoubleCurrencyLogo size={55} currency0={currency0} currency1={currency1} />
      </Box>
      <Divider />

      <StatWrapper>
        {isStaking ? (
          <Stat
            title={'Your TVL'}
            stat={numeral((yourStackedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
          />
        ) : (
          <Stat
            title={'TVL'}
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

        <Box display="inline-block">
          <Text color="text1" fontSize={16}>
            {t('earn.rewardsIn')}
          </Text>

          <Box display="flex" alignItems="center" mt="5px">
            <RewardTokens rewardTokens={rewardTokens} size={24} />
          </Box>
        </Box>
      </StatWrapper>

      <InnerWrapper>
        <Box>
          <DetailButton variant="plain" onClick={() => onClickViewDetail()} color="text1" height="45px">
            {t('pool.seeDetails')}
          </DetailButton>
        </Box>
        <Box>
          {isStaking && Boolean(stakingInfo.earnedAmount.greaterThan('0')) ? (
            <ActionButon
              variant="plain"
              onClick={() => onClickClaim()}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('earnPage.claim')}
            </ActionButon>
          ) : isLiquidity ? (
            <ActionButon
              variant="plain"
              onClick={() => onClickStake()}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('earnPage.stake')}
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

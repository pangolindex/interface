import React, { useState } from 'react'
import { Fraction, ChainId } from '@pangolindex/sdk'
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
import { Text, Box, DoubleCurrencyLogo } from '@antiyro/components'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { StakingInfo } from 'src/state/stake/hooks'
import { usePair } from 'src/data/Reserves'
// import { useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { useTokens } from 'src/hooks/Tokens'
import RewardTokens from 'src/components/RewardTokens'
import { useActiveWeb3React } from 'src/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import ClaimDrawer from '../../ClaimDrawer'
import FarmDrawer from '../../FarmDrawer'
import AddLiquidityDrawer from '../../AddLiquidityDrawer'
import { useChainId } from 'src/hooks'

export interface PoolCardProps {
  stakingInfo: StakingInfo
  onClickViewDetail: () => void
  version: number
}

const PoolCard = ({ stakingInfo, onClickViewDetail, version }: PoolCardProps) => {
  const { t } = useTranslation()
  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false)

  const [isFarmDrawerVisible, setShowFarmDrawer] = useState(false)
  const [isAddLiquidityDrawerVisible, setShowAddLiquidityDrawer] = useState(false)

  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  const [, stakingTokenPair] = usePair(token0, token1)

  const rewardTokens = useTokens(stakingInfo?.rewardTokensAddress)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const yourStackedInUsd = chainId !== ChainId.WAGMI
    ? stakingInfo?.totalStakedInUsd.multiply(stakingInfo?.stakedAmount).divide(stakingInfo?.totalStakedAmount)
    : undefined

  // const { userPgl } = useGetPoolDollerWorth(stakingTokenPair)
  const userPgl = useTokenBalance(account ?? undefined, stakingTokenPair?.liquidityToken)

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

        <DoubleCurrencyLogo size={48} currency0={currency0} currency1={currency1} />
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
              onClick={() => setShowClaimDrawer(true)}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('earnPage.claim')}
            </ActionButon>
          ) : isLiquidity ? (
            <ActionButon
              variant="plain"
              onClick={() => setShowFarmDrawer(true)}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('header.farm')}
            </ActionButon>
          ) : (
            <ActionButon
              variant="plain"
              onClick={() => setShowAddLiquidityDrawer(true)}
              backgroundColor="bg2"
              color="text1"
              height="45px"
            >
              {t('pool.addLiquidity')}
            </ActionButon>
          )}
        </Box>
      </InnerWrapper>
      {isClaimDrawerVisible && (
        <ClaimDrawer
          isOpen={isClaimDrawerVisible}
          onClose={() => {
            setShowClaimDrawer(false)
          }}
          stakingInfo={stakingInfo}
          version={version}
          backgroundColor="color5"
        />
      )}

      {isFarmDrawerVisible && (
        <FarmDrawer
          isOpen={isFarmDrawerVisible}
          onClose={() => {
            setShowFarmDrawer(false)
          }}
          clickedLpTokens={stakingInfo?.tokens}
          version={version}
          backgroundColor="color5"
          combinedApr={stakingInfo?.combinedApr}
        />
      )}

      {isAddLiquidityDrawerVisible && (
        <AddLiquidityDrawer
          isOpen={isAddLiquidityDrawerVisible}
          onClose={() => {
            setShowAddLiquidityDrawer(false)
          }}
          clickedLpTokens={stakingInfo?.tokens}
          backgroundColor="color5"
        />
      )}
    </Panel>
  )
}

export default PoolCard

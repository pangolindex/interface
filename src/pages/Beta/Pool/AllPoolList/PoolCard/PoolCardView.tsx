import React, { useState } from 'react'
import { Fraction, CHAINS, TokenAmount, Token } from '@pangolindex/sdk'
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
import RewardTokens from 'src/components/RewardTokens'
import { useActiveWeb3React, useChainId } from 'src/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import ClaimDrawer from '../../ClaimDrawer'
import FarmDrawer from '../../FarmDrawer'
import AddLiquidityDrawer from '../../AddLiquidityDrawer'

export interface PoolCardViewProps {
  stakingInfo: StakingInfo
  onClickViewDetail: () => void
  version: number
  combinedApr?: number
  earnedAmount: TokenAmount
  rewardTokens?: Array<Token | null | undefined> | null
}

const PoolCardView = ({
  stakingInfo,
  onClickViewDetail,
  version,
  combinedApr,
  earnedAmount,
  rewardTokens
}: PoolCardViewProps) => {
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

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const yourStackedInUsd = CHAINS[chainId]?.mainnet
    ? stakingInfo?.totalStakedInUsd.multiply(stakingInfo?.stakedAmount).divide(stakingInfo?.totalStakedAmount)
    : undefined

  const userPgl = useTokenBalance(account ?? undefined, stakingTokenPair?.liquidityToken)

  const isLiquidity = Boolean(userPgl?.greaterThan('0'))

  const isSuperFarm =
    version > 1 ? (rewardTokens || [])?.length > 1 : (stakingInfo?.rewardTokensAddress || [])?.length > 0

  const renderButton = () => {
    if (isStaking && Boolean(earnedAmount.greaterThan('0')))
      return (
        <ActionButon
          variant="plain"
          onClick={() => setShowClaimDrawer(true)}
          backgroundColor="bg2"
          color="text1"
          height="45px"
        >
          {t('earnPage.claim')}
        </ActionButon>
      )
    else if (isLiquidity) {
      return (
        <ActionButon
          variant="plain"
          onClick={() => setShowFarmDrawer(true)}
          backgroundColor="bg2"
          color="text1"
          height="45px"
        >
          {t('header.farm')}
        </ActionButon>
      )
    } else {
      return (
        <ActionButon
          variant="plain"
          onClick={() => setShowAddLiquidityDrawer(true)}
          backgroundColor="bg2"
          color="text1"
          height="45px"
        >
          {t('pool.addLiquidity')}
        </ActionButon>
      )
    }
  }

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
          stat={combinedApr ? `${combinedApr}%` : '-'}
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
          <DetailButton
            variant="plain"
            onClick={() => {
              onClickViewDetail()
            }}
            color="text1"
            height="45px"
          >
            {t('pool.seeDetails')}
          </DetailButton>
        </Box>
        <Box>{renderButton()}</Box>
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
          version={version}
          backgroundColor="color5"
          stakingInfo={stakingInfo}
          combinedApr={version > 1 ? combinedApr : undefined}
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

export default PoolCardView

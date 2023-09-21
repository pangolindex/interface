import { Box, Button, Text, Stat } from '@honeycomb-finance/core'
import { useTranslation } from '@honeycomb-finance/shared'
import { useUSDCPrice } from '@honeycomb-finance/state-hooks'
import { JSBI, CHAINS } from '@pangolindex/sdk'
import React, { useState } from 'react'
import numeral from 'numeral'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { Root, StatWrapper } from './styled'
import ClaimDrawer from '../../ClaimDrawer'
import UnstakeDrawer from '../UnstakeDrawer'
import { useChainId } from 'src/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
}

const EarnedWidget: React.FC<Props> = ({ stakingInfo }) => {
  const { t } = useTranslation()

  const chainId = useChainId()

  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false)
  const [isUnstakeDrawerVisible, setShowUnstakeDrawer] = useState(false)

  const rewardToken = stakingInfo?.rewardToken
  const usdcPriceTmp = useUSDCPrice(rewardToken)
  const usdcPrice = CHAINS[chainId]?.mainnet ? usdcPriceTmp : undefined

  const weeklyRewardInToken = stakingInfo?.rewardRatePerWeek.toSignificant(4)
  const unclaimedAmountInToken = stakingInfo?.earnedAmount.toSignificant(4)

  const weeklyRewardUSD = CHAINS[chainId]?.mainnet
    ? Number(weeklyRewardInToken) * Number(usdcPrice?.toSignificant(4))
    : undefined
  const unclaimedAmountInUSD = CHAINS[chainId]?.mainnet
    ? Number(unclaimedAmountInToken) * Number(usdcPrice?.toSignificant(4))
    : undefined

  return (
    <Root>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text color="text10" fontSize={['24px', '20px']} fontWeight={500}>
          Earned
        </Text>

        {/* show unstak button */}
        {stakingInfo?.stakedAmount?.greaterThan('0') && (
          <Button
            variant="primary"
            backgroundColor="color9"
            color="color4"
            width="100px"
            height="30px"
            onClick={() => setShowUnstakeDrawer(true)}
          >
            {t('earnPage.unstake')}
          </Button>
        )}
      </Box>

      <StatWrapper>
        <Box>
          <Stat
            title={t('dashboardPage.earned_weeklyIncome')}
            stat={!isNaN(weeklyRewardUSD as number) ? numeral(weeklyRewardUSD).format('$0.00a') : '0'}
            titlePosition="top"
            titleFontSize={[16, 12]}
            statFontSize={[24, 20]}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('dashboardPage.earned_weeklyIncome')}
            stat={numeral(weeklyRewardInToken).format('0.0000a')}
            titlePosition="top"
            titleFontSize={[16, 12]}
            statFontSize={[24, 20]}
            titleColor="text2"
            currency={rewardToken}
          />
        </Box>
      </StatWrapper>

      <StatWrapper>
        <Box>
          <Stat
            title={t('dashboardPage.earned_totalEarned')}
            stat={!isNaN(unclaimedAmountInUSD as number) ? numeral(unclaimedAmountInUSD).format('$0.00a') : '0'}
            titlePosition="top"
            titleFontSize={[16, 12]}
            statFontSize={[24, 20]}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('dashboardPage.earned_totalEarned')}
            stat={numeral(unclaimedAmountInToken).format('0.0000a')}
            titlePosition="top"
            titleFontSize={[16, 12]}
            statFontSize={[24, 20]}
            titleColor="text2"
            currency={rewardToken}
          />
        </Box>
      </StatWrapper>

      <Box mt={15}>
        <Button
          padding="15px 18px"
          isDisabled={!stakingInfo?.earnedAmount?.greaterThan(JSBI.BigInt(0))}
          variant="primary"
          onClick={() => setShowClaimDrawer(true)}
        >
          {t('earnPage.claim')}
        </Button>
      </Box>

      <ClaimDrawer
        isOpen={isClaimDrawerVisible}
        onClose={() => {
          setShowClaimDrawer(false)
        }}
        stakingInfo={stakingInfo}
      />

      <UnstakeDrawer
        isOpen={isUnstakeDrawerVisible}
        onClose={() => {
          setShowUnstakeDrawer(false)
        }}
        stakingInfo={stakingInfo}
      />
    </Root>
  )
}

export default EarnedWidget

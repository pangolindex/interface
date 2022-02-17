import { Box, Button, Text } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { Root, StatWrapper } from './styled'
import ClaimDrawer from '../../ClaimDrawer'
import UnstakeDrawer from '../UnstakeDrawer'

type Props = {
  stakingInfo: SingleSideStakingInfo
}

const EarnedWidget: React.FC<Props> = ({ stakingInfo }) => {
  const { t } = useTranslation()
  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false)
  const [isUnstakeDrawerVisible, setShowUnstakeDrawer] = useState(false)

  const rewardToken = stakingInfo?.rewardToken
  const usdcPrice = useUSDCPrice(rewardToken)

  const dailyRewardInToken = stakingInfo?.rewardRatePerWeek.toSignificant(4)
  const unclaimedAmountInToken = stakingInfo?.earnedAmount.toSignificant(4)

  const dailyRewardUSD = Number(dailyRewardInToken) * Number(usdcPrice?.toSignificant(6))
  const unclaimedAmountInUSD = Number(unclaimedAmountInToken) * Number(usdcPrice?.toSignificant(6))

  return (
    <Root>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text color="text10" fontSize={24} fontWeight={500}>
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
            title={t('dashboardPage.earned_dailyIncome')}
            stat={numeral(dailyRewardUSD).format('$0.00a')}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('dashboardPage.earned_dailyIncome')}
            stat={dailyRewardInToken}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
            titleColor="text2"
            currency={rewardToken}
          />
        </Box>
      </StatWrapper>

      <StatWrapper>
        <Box>
          <Stat
            title={t('dashboardPage.earned_totalEarned')}
            stat={numeral(unclaimedAmountInUSD).format('$0.00a')}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('dashboardPage.earned_totalEarned')}
            stat={unclaimedAmountInToken}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={24}
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

      {isClaimDrawerVisible && (
        <ClaimDrawer
          isOpen={isClaimDrawerVisible}
          onClose={() => {
            setShowClaimDrawer(false)
          }}
          stakingInfo={stakingInfo}
        />
      )}

      {/* Unstake Drawer */}
      {isUnstakeDrawerVisible && (
        <UnstakeDrawer
          isOpen={isUnstakeDrawerVisible}
          onClose={() => {
            setShowUnstakeDrawer(false)
          }}
          stakingInfo={stakingInfo}
        />
      )}
    </Root>
  )
}

export default EarnedWidget

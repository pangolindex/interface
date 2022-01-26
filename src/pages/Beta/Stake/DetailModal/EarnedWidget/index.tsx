import { Box, Button, Text, ToggleButtons } from '@pangolindex/components'
import { JSBI } from '@pangolindex/sdk'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { Root } from './styled'

type Props = {
  stakingInfo: SingleSideStakingInfo
}

enum SHOW_TYPE {
  TOKEN,
  USD
}

const StakeWidget: React.FC<Props> = ({ stakingInfo }) => {
  const { t } = useTranslation()
  const [showType, setShowType] = useState(SHOW_TYPE.TOKEN)

  const earnedToken = stakingInfo?.earnedAmount?.token?.symbol || ''
  const usdcPrice = useUSDCPrice(stakingInfo?.earnedAmount?.token)

  const dailyRewardInToken = stakingInfo?.rewardRate?.multiply((60 * 60 * 24).toString()).toSignificant(4)
  const unclaimedAmountInToken = stakingInfo?.earnedAmount.toSignificant(4)

  const dailyRewardUSD = Number(dailyRewardInToken) * Number(usdcPrice?.toSignificant(6))
  const unclaimedAmountInUSD = Number(unclaimedAmountInToken) * Number(usdcPrice?.toSignificant(6))

  const dailyReward = showType === SHOW_TYPE.TOKEN ? dailyRewardInToken : numeral(dailyRewardUSD).format('$0.00a')
  const tokenToDisplay = showType === SHOW_TYPE.TOKEN ? earnedToken : ''
  const unclaimedAmount =
    showType === SHOW_TYPE.TOKEN ? unclaimedAmountInToken : numeral(unclaimedAmountInUSD).format('$0.00a')

  return (
    <Root>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text10" fontSize={20} fontWeight={500}>
          Earned
        </Text>
        <ToggleButtons
          options={['USD', earnedToken]}
          value={showType === SHOW_TYPE.TOKEN ? earnedToken : 'USD'}
          onChange={value => {
            setShowType(value === 'USD' ? SHOW_TYPE.USD : SHOW_TYPE.TOKEN)
          }}
        />
      </Box>

      <Box mt={10}>
        <Stat
          title={t('dashboardPage.earned_dailyIncome')}
          stat={`${dailyReward || '-'} ${tokenToDisplay}`}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
          currency={showType === SHOW_TYPE.TOKEN ? stakingInfo?.earnedAmount?.token : undefined}
        />
      </Box>

      <Box mt={10}>
        <Stat
          title={t('dashboardPage.earned_totalEarned')}
          stat={`${unclaimedAmount} ${tokenToDisplay}`}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
          currency={showType === SHOW_TYPE.TOKEN ? stakingInfo?.earnedAmount?.token : undefined}
        />
      </Box>

      {stakingInfo?.earnedAmount?.greaterThan(JSBI.BigInt(0)) && (
        <Box mt={15}>
          <Button padding="15px 18px" variant="primary">
            {t('earnPage.claim')}
          </Button>
        </Box>
      )}
    </Root>
  )
}

export default StakeWidget

import { Box, Button, Text, ToggleButtons } from '@0xkilo/components'
import { JSBI, ChainId } from '@antiyro/sdk'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { Root } from './styled'
import { CHAINS } from 'src/constants/chains'
import { useActiveWeb3React } from 'src/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClaimClick: () => void
}

enum SHOW_TYPE {
  TOKEN,
  USD
}

const EarnedWidget: React.FC<Props> = ({ stakingInfo, onClaimClick }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [showType, setShowType] = useState(SHOW_TYPE.TOKEN)

  const rewardTokenSymbol = stakingInfo?.rewardToken?.symbol || ''
  const rewardToken = stakingInfo?.rewardToken
  const usdcPriceTmp = useUSDCPrice(rewardToken)
  const usdcPrice = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? usdcPriceTmp : undefined

  const dailyRewardInToken = stakingInfo?.rewardRate?.multiply((60 * 60 * 24).toString()).toSignificant(4)
  const unclaimedAmountInToken = stakingInfo?.earnedAmount.toSignificant(4)

  const dailyRewardUSD = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? Number(dailyRewardInToken) * Number(usdcPrice?.toSignificant(6)) : undefined
  const unclaimedAmountInUSD = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? Number(unclaimedAmountInToken) * Number(usdcPrice?.toSignificant(6)) : undefined

  const dailyReward = showType === SHOW_TYPE.TOKEN ? dailyRewardInToken : numeral(dailyRewardUSD).format('$0.00a')
  const tokenToDisplay = showType === SHOW_TYPE.TOKEN ? rewardTokenSymbol : ''
  const unclaimedAmount =
    showType === SHOW_TYPE.TOKEN ? unclaimedAmountInToken : numeral(unclaimedAmountInUSD).format('$0.00a')

  return (
    <Root>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text10" fontSize={20} fontWeight={500}>
          Earned
        </Text>
        <ToggleButtons
          options={['USD', rewardTokenSymbol]}
          value={showType === SHOW_TYPE.TOKEN ? rewardTokenSymbol : 'USD'}
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
          currency={showType === SHOW_TYPE.TOKEN ? rewardToken : undefined}
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
          currency={showType === SHOW_TYPE.TOKEN ? rewardToken : undefined}
        />
      </Box>

      {stakingInfo?.earnedAmount?.greaterThan(JSBI.BigInt(0)) && (
        <Box mt={15}>
          <Button padding="15px 18px" variant="primary" onClick={onClaimClick}>
            {t('earnPage.claim')}
          </Button>
        </Box>
      )}
    </Root>
  )
}

export default EarnedWidget

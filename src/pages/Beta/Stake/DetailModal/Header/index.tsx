import { Box, DoubleCurrencyLogo, Text } from '@0xkilo/components'
import React, { useContext } from 'react'
import { JSBI, ChainId } from '@antiyro/sdk'
import Stat from 'src/components/Stat'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { ThemeContext } from 'styled-components'
import { HeaderRoot, StatsWrapper } from './styled'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from 'src/theme'
import { useActiveWeb3React } from 'src/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const Header: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const { chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(stakingInfo?.totalStakedAmount?.token, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(stakingInfo?.rewardToken, chainId || ChainId.AVALANCHE)
  const totalRewardRate = stakingInfo?.totalRewardRate
    ?.multiply((60 * 60 * 24 * 7).toString())
    ?.toSignificant(4, { groupSeparator: ',' })

  const userRewardRate = stakingInfo?.rewardRate
    ?.multiply((60 * 60 * 24 * 7).toString())
    ?.toSignificant(4, { groupSeparator: ',' })

  return (
    <HeaderRoot>
      <Box display="flex" alignItems="center">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={35} />
        <Text color="text1" fontSize={24} fontWeight={500} marginLeft={10}>
          {currency0?.symbol}/{currency1?.symbol}
        </Text>
      </Box>
      <StatsWrapper>
        <Stat
          title={`Total APR`}
          stat={
            JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
              ? `${stakingInfo.apr.toLocaleString()}%`
              : ' - '
          }
          titlePosition="top"
          titleFontSize={14}
          statFontSize={20}
          titleColor="text2"
        />
        {stakingInfo.stakedAmount.greaterThan('0') && (
          <Stat
            title={`Your Rate`}
            stat={
              userRewardRate ? `${userRewardRate} ${t('earnPage.rewardPerWeek', { symbol: currency1?.symbol })}` : '-'
            }
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
          />
        )}
        <Stat
          title={`Pool Rate`}
          stat={
            totalRewardRate ? `${totalRewardRate} ${t('earnPage.rewardPerWeek', { symbol: currency1?.symbol })}` : '-'
          }
          titlePosition="top"
          titleFontSize={14}
          statFontSize={20}
          titleColor="text2"
        />
        <CloseIcon onClick={onClose} color={theme.text3} />
      </StatsWrapper>
    </HeaderRoot>
  )
}

export default Header

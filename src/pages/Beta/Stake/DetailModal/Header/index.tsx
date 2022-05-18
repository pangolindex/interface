import { Box, DoubleCurrencyLogo, Text, CurrencyLogo } from '@pangolindex/components'
import React, { useContext } from 'react'
import { JSBI } from '@pangolindex/sdk'
import Stat from 'src/components/Stat'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { ThemeContext } from 'styled-components'
import { HeaderRoot, StatsWrapper, HeaderWrapper } from './styled'
import { useTranslation } from 'react-i18next'
import { CloseIcon, Hidden, Visible  } from 'src/theme'
import { useChainId } from 'src/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const Header: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const chainId = useChainId()

  const currency0 = unwrappedToken(stakingInfo?.totalStakedAmount?.token, chainId)
  const currency1 = unwrappedToken(stakingInfo?.rewardToken, chainId)
  const totalRewardRate = stakingInfo?.totalRewardRatePerSecond
    ?.multiply((60 * 60 * 24 * 7).toString())
    ?.toSignificant(4, { groupSeparator: ',' })

  const userRewardRate = stakingInfo?.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' })

  return (
    <HeaderRoot>
      <HeaderWrapper>
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={48} />
          <Text color="text1" fontSize={24} fontWeight={500} marginLeft={10}>
            {currency0?.symbol}/{currency1?.symbol}
          </Text>
        </Box>
        <Visible upToSmall={true}>
          <CloseIcon onClick={onClose} color={theme.text3} />
        </Visible>
      </HeaderWrapper>

      <StatsWrapper isStake={stakingInfo.stakedAmount.greaterThan('0')}>
        <Box display="inline-block">
          <Text color="text2" fontSize={14}>
            {t('earn.poolRewards')}
          </Text>

          <Box display="flex" alignItems="center" mt="10px">
            <CurrencyLogo currency={currency1} size={24} imageSize={48} />
          </Box>
        </Box>

        <Stat
          title={`APR`}
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
            title={`Your Weekly Rate`}
            stat={userRewardRate ? `${userRewardRate}` : '-'}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
            currency={currency1}
          />
        )}
        <Stat
          title={`Weekly Pool Rate`}
          stat={totalRewardRate ? `${totalRewardRate}` : '-'}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={20}
          titleColor="text2"
          currency={currency1}
        />
        <Hidden upToSmall={true}>
          <CloseIcon onClick={onClose} color={theme.text3} />
        </Hidden>
      </StatsWrapper>
    </HeaderRoot>
  )
}

export default Header

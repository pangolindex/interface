import { Box, DoubleCurrencyLogo, Text } from '@pangolindex/components'
import React, { useContext } from 'react'
import Stat from 'src/components/Stat'
import { StakingInfo, useGetFarmApr } from 'src/state/stake/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { ThemeContext } from 'styled-components'
import { HeaderRoot, StatsWrapper, HeaderWrapper } from './styled'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from 'src/theme'
import { Hidden, Visible } from 'src/theme'
import RewardTokens from 'src/components/RewardTokens'
import { useChainId } from 'src/hooks'

type Props = {
  stakingInfo: StakingInfo
  onClose: () => void
}

const Header: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const theme = useContext(ThemeContext)
  const chainId = useChainId()

  const { t } = useTranslation()

  const token0 = stakingInfo?.tokens[0]
  const token1 = stakingInfo?.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  const rewardTokens = stakingInfo?.rewardTokens

  const { swapFeeApr, stakingApr } = useGetFarmApr(stakingInfo?.pid as string)

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

      <StatsWrapper>
        <Box display="inline-block">
          <Text color="text2" fontSize={14}>
            {t('earn.poolRewards')}
          </Text>

          <Box display="flex" alignItems="center" mt="5px">
            <RewardTokens rewardTokens={rewardTokens} size={24} />
          </Box>
        </Box>

        <Stat
          title={`Swap fee APR:`}
          stat={swapFeeApr && !stakingInfo.isPeriodFinished ? `${swapFeeApr}%` : '-'}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
        />
        <Stat
          title={`Reward APR:`}
          stat={stakingApr && !stakingInfo.isPeriodFinished ? `${stakingApr}%` : '-'}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
        />
        <Stat
          title={`Total APR:`}
          stat={swapFeeApr && !stakingInfo.isPeriodFinished ? `${swapFeeApr + (stakingApr || 0)}%` : '-'}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
        />
        <Hidden upToSmall={true}>
          <CloseIcon onClick={onClose} color={theme.text3} />
        </Hidden>
      </StatsWrapper>
    </HeaderRoot>
  )
}

export default Header

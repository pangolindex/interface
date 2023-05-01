import React, { useMemo } from 'react'
import {
  CurrencyLogo,
  Text,
  useSarStakeInfo,
  useSarPositionsHook,
  Position,
  Tokens,
  useTranslation
} from '@pangolindex/components'
import { BigNumber } from '@ethersproject/bignumber'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { useChainId } from 'src/hooks'
import { StatWrapper, Title, Wrapper } from './styleds'
import { formatUnits } from 'ethers/lib/utils'

const StakeStat: React.FC = () => {
  const chainId = useChainId()
  const { t } = useTranslation()
  const { apr, totalStaked } = useSarStakeInfo()

  const useSarPositions = useSarPositionsHook[chainId]
  const { positions = [] as Position[] } = useSarPositions()

  const filteredPositions = positions.filter(position => !position.balance.isZero()) // remove zero balances

  const userTotalStaked = useMemo(() => {
    if (filteredPositions.length === 0) return BigNumber.from(0)

    return filteredPositions.reduce((acc, cur) => acc.add(cur.balance), BigNumber.from(0))
  }, [filteredPositions])

  const userAverageApr = useMemo(() => {
    if (filteredPositions.length === 0 || userTotalStaked.isZero()) return BigNumber.from(0)
    const totalRewardRate = filteredPositions.reduce((acc, cur) => acc.add(cur.rewardRate), BigNumber.from(0))
    return totalRewardRate
      .mul(86400)
      .mul(365)
      .mul(100)
      .div(userTotalStaked)
  }, [filteredPositions, userTotalStaked])
  const { PNG } = Tokens
  const png = PNG[chainId]

  return (
    <Wrapper>
      <Title>
        <CurrencyLogo currency={png} size={48} />
        <Text color="text1" fontSize="24px">
          {png.symbol} {t('header.stake')}
        </Text>
      </Title>

      <StatWrapper>
        <Stat
          title={t('pool.yourStake')}
          titlePosition="top"
          stat={`${numeral(formatUnits(userTotalStaked, png.decimals)).format('0.00a')} ${PNG[chainId].symbol}`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title={t('pool.yourAverageAPR')}
          titlePosition="top"
          stat={`${userAverageApr.toString()}%`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title={`Total ${png.symbol}`}
          titlePosition="top"
          stat={`${numeral(parseFloat(totalStaked.toSignificant(6))).format('0.00a')} `}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title={t('sarPortfolio.apr')}
          titlePosition="top"
          stat={`${(apr ?? '-').toString()}%`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
      </StatWrapper>
    </Wrapper>
  )
}

export default StakeStat

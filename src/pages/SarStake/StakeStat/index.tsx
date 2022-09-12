import React, { useMemo } from 'react'
import { CurrencyLogo, Text, useSarStakeInfo, useSarPositions, Position } from '@pangolindex/components'
import { BigNumber } from '@ethersproject/bignumber'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'
import { DestkopDetails, MobileDetails, Title, Wrapper } from './styleds'
import { formatEther } from 'ethers/lib/utils'

const StakeStat: React.FC = () => {
  const chainId = useChainId()
  const { apr, totalStaked } = useSarStakeInfo()
  const { data: positions = [] as Position[] } = useSarPositions()

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
  }, [filteredPositions])

  return (
    <Wrapper>
      <Title>
        <CurrencyLogo currency={PNG[chainId]} size={48} />
        <Text color="text1" fontSize="24px">
          {PNG[chainId].symbol} Stake
        </Text>
      </Title>

      <DestkopDetails upToMedium={true}>
        <Stat
          title="Your Stake"
          titlePosition="top"
          stat={`${numeral(formatEther(userTotalStaked)).format('0.00a')} ${PNG[chainId].symbol}`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title="Your Average APR"
          titlePosition="top"
          stat={`${userAverageApr.toString()}%`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title="Total PNG"
          titlePosition="top"
          stat={`${numeral(parseFloat(totalStaked.toSignificant(6))).format('0.00a')} `}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
        <Stat
          title="APR"
          titlePosition="top"
          stat={`${(apr ?? '-').toString()}%`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={18}
        />
      </DestkopDetails>
      <MobileDetails upToSmall={true}>
        <Stat
          title="APR"
          titlePosition="top"
          stat={`${(apr ?? '-').toString()}%`}
          titleColor="text2"
          statColor="text1"
          titleFontSize={12}
          statFontSize={18}
        />
      </MobileDetails>
    </Wrapper>
  )
}

export default StakeStat

import React, { useMemo } from 'react'
import { CurrencyLogo, Text, useSarStakeInfo, useSarPositionsHook, Position, Tokens } from '@pangolindex/components'
import { BigNumber } from '@ethersproject/bignumber'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import { useChainId } from 'src/hooks'
import { DestkopDetails, MobileDetails, Title, Wrapper } from './styleds'
import { formatUnits } from 'ethers/lib/utils'

const StakeStat: React.FC = () => {
  const chainId = useChainId()
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
          {png.symbol} Stake
        </Text>
      </Title>

      <DestkopDetails upToMedium={true}>
        <Stat
          title="Your Stake"
          titlePosition="top"
          stat={`${numeral(formatUnits(userTotalStaked, png.decimals)).format('0.00a')} ${PNG[chainId].symbol}`}
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
          title={`Total ${png.symbol}`}
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

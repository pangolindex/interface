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

  const userTotalStaked = useMemo(() => {
    if (positions.length === 0) return BigNumber.from(0)

    return positions.reduce((acc, cur) => {
      return acc.add(cur.balance)
    }, BigNumber.from(0))
  }, [positions])

  const userAverageApr = useMemo(() => {
    if (positions.length === 0) return BigNumber.from(0)
    const _positions = positions.filter(position => !position.balance.isZero()) // remove zero balances
    const totalAPR = _positions.reduce((acc, cur) => {
      return acc.add(cur.apr)
    }, BigNumber.from(0))
    return totalAPR.div(_positions.length)
  }, [positions])

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

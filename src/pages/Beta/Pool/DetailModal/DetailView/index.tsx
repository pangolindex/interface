import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Wrapper, PanelWrapper, HeaderGridContainer, EarnWrapper, DetailContainer, TabView } from './styleds'
import { Fraction } from '@pangolindex/sdk'
import { CloseIcon } from 'src/theme/components'
import { StakingInfo, useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import Stat from 'src/components/Stat'
import numeral from 'numeral'
import { usePair } from 'src/data/Reserves'
import CoinInfo from '../CoinInfo'
import StatDetail from '../StatDetail'
import EarnWidget from '../../EarnWidget'

export interface PoolDetailProps {
  onDismiss: () => void
  selectedPool: StakingInfo
  version: string
}

const DetailView = ({ selectedPool, onDismiss, version }: PoolDetailProps) => {
  // const { account } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  const token0 = selectedPool?.tokens[0]
  const token1 = selectedPool?.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const totalStakedInUsd = numeral(selectedPool.totalStakedInUsd.toSignificant(4)).format('$0.00a')

  const isStaking = Boolean(selectedPool.stakedAmount.greaterThan('0'))

  let yourStackedInUsd = selectedPool?.totalStakedInUsd
    .multiply(selectedPool?.stakedAmount)
    .divide(selectedPool?.totalStakedAmount)

  const [, stakingTokenPair] = usePair(token0, token1)
  const pair = stakingTokenPair
  const { userPgl, yourLiquidityAmount } = useGetPoolDollerWorth(pair)

  return (
    <Wrapper>
      <HeaderGridContainer>
        <Box padding={'0px 50px'} display="flex" alignItems="center">
          <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
          <Text color="text1" fontSize={24} fontWeight={500} lineHeight="55px" marginLeft={10}>
            {currency0?.symbol}/{currency1?.symbol}
          </Text>
        </Box>
        <PanelWrapper>
          <Box padding="10px 6px">
            <Stat
              title={`Swap fee APR:`}
              stat={`${
                selectedPool?.swapFeeApr && !selectedPool.isPeriodFinished ? `${selectedPool?.swapFeeApr}%` : '-'
              }`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Reward APR:`}
              stat={`${
                selectedPool?.stakingApr && !selectedPool.isPeriodFinished ? `${selectedPool?.stakingApr}%` : '-'
              }`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Total APR:`}
              stat={`${
                selectedPool?.swapFeeApr && !selectedPool.isPeriodFinished
                  ? `${selectedPool?.swapFeeApr + (selectedPool?.stakingApr || 0)}%`
                  : '-'
              }`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Pool Weight`}
              stat={`${selectedPool?.multiplier}X`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>
        </PanelWrapper>
        <Box mt={20}>
          <CloseIcon onClick={onDismiss} color={theme.text3} />
        </Box>
      </HeaderGridContainer>

      <Box display="flex">
        <Box borderRight={`1px solid ${theme.text9}`}>
          <TabView>
            <Text color="text10" fontSize={18}>
              Details
            </Text>
          </TabView>
          <DetailContainer>
            <StatDetail
              title={`Total Stake`}
              currency0={currency0}
              currency1={currency1}
              pair={pair}
              totalAmount={`${totalStakedInUsd}`}
              pgl={selectedPool?.totalStakedAmount}
            />

            {Number(yourLiquidityAmount?.toFixed(4)) > 0 && (
              <Box mt={25}>
                <StatDetail
                  title={`Your Liquidity`}
                  currency0={currency0}
                  currency1={currency1}
                  pair={pair}
                  totalAmount={`${yourLiquidityAmount ? `$${yourLiquidityAmount?.toFixed(4)}` : '-'}`}
                  pgl={userPgl}
                />
              </Box>
            )}

            {isStaking && (
              <Box mt={25}>
                <StatDetail
                  title={`Your Stake`}
                  currency0={currency0}
                  currency1={currency1}
                  pair={pair}
                  totalAmount={`${numeral((yourStackedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}`}
                  pgl={selectedPool?.stakedAmount}
                />
              </Box>
            )}

            <Box mt={20}>
              <CoinInfo coin={currency0} />
            </Box>

            <Box mt={20}>
              <CoinInfo coin={currency1} />
            </Box>
          </DetailContainer>
        </Box>

        <EarnWrapper>
          <EarnWidget currencyA={currency0} currencyB={currency1} version={version} pair={pair} />
        </EarnWrapper>
      </Box>
    </Wrapper>
  )
}
export default DetailView

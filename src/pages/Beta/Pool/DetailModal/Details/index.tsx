import React from 'react'
import { StakingInfo, useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { CAVAX, Fraction, Token, ChainId } from '@pangolindex/sdk'
import { DetailsContainer } from './styled'
import { Box } from '@pangolindex/components'
import CoinDescription from 'src/components/Beta/CoinDescription'
import { usePair } from 'src/data/Reserves'
import StatDetail from '../StatDetail'
import numeral from 'numeral'
import { useActiveWeb3React } from 'src/hooks'
import { CHAINS } from 'src/constants/chains'
import { useChainId } from 'src/hooks'

type Props = {
  stakingInfo: StakingInfo
}

const Details: React.FC<Props> = ({ stakingInfo }) => {
  const token0 = stakingInfo?.tokens[0]
  const token1 = stakingInfo?.tokens[1]
  const { chainId } = useActiveWeb3React()

  const totalStakedInUsd = CHAINS[useChainId()].is_mainnet
    ? numeral(stakingInfo.totalStakedInUsd.toSignificant(4)).format('$0.00a')
    : numeral(stakingInfo.totalStakedInUsd).format('$0.00a')

  const yourStakeInUsd = CHAINS[useChainId()].is_mainnet
    ? stakingInfo?.totalStakedInUsd.multiply(stakingInfo?.stakedAmount).divide(stakingInfo?.totalStakedAmount)
    : undefined

  const [, stakingTokenPair] = usePair(token0, token1)
  const pair = stakingTokenPair
  const { userPgl, liquidityInUSD } = useGetPoolDollerWorth(pair)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const currency0 = pair?.token0 ? unwrappedToken(pair?.token0, chainId || ChainId.AVALANCHE) : undefined
  const currency1 = pair?.token1 ? unwrappedToken(pair?.token1, chainId || ChainId.AVALANCHE) : undefined

  return (
    <>
      <DetailsContainer>
        <StatDetail
          title={`Total Stake`}
          currency0={currency0}
          currency1={currency1}
          pair={pair}
          totalAmount={`${totalStakedInUsd}`}
          pgl={stakingInfo?.totalStakedAmount}
        />

        {Number(liquidityInUSD?.toFixed(4)) > 0 && (
          <Box mt={25}>
            <StatDetail
              title={`Your Liquidity`}
              currency0={currency0}
              currency1={currency1}
              pair={pair}
              totalAmount={`${liquidityInUSD ? `$${liquidityInUSD?.toFixed(2)}` : '-'}`}
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
              totalAmount={`${numeral((yourStakeInUsd as Fraction)?.toFixed(2)).format('$0.00a')}`}
              pgl={stakingInfo?.stakedAmount}
            />
          </Box>
        )}
        {currency0 !== CAVAX[useChainId()] && currency0 instanceof Token && (
          <Box mt={20}>
            <CoinDescription coin={currency0} />
          </Box>
        )}

        {currency1 !== CAVAX[useChainId()] && currency1 instanceof Token && (
          <Box mt={20}>
            <CoinDescription coin={currency1} />
          </Box>
        )}
      </DetailsContainer>
    </>
  )
}

export default Details

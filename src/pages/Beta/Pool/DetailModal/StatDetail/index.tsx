import React from 'react'
import { Text, Box } from '@0xkilo/components'
import { JSBI, Pair, TokenAmount, Currency, ChainId } from '@antiyro/sdk'
import { useTotalSupply } from 'src/data/TotalSupply'
import { useActiveWeb3React } from 'src/hooks'
import { StateContainer } from './styleds'
import Stat from 'src/components/Stat'
import { CHAINS } from 'src/constants/chains'

interface Props {
  title: String
  totalAmount: string
  pair: Pair | null
  pgl?: TokenAmount | undefined
  currency0: Currency | undefined
  currency1: Currency | undefined
}

export default function StatDetail({ title, totalAmount, pair, pgl, currency0, currency1 }: Props) {
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)
  const { chainId } = useActiveWeb3React()
  pgl = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? pgl : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!pgl &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, pgl.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, pgl, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, pgl, false)
        ]
      : [undefined, undefined]
  return (
    <Box>
      <Text color="text1" fontSize={24} fontWeight={400}>
        {title}
      </Text>

      <StateContainer>
        <Stat
          title={title}
          stat={`${totalAmount ? `${totalAmount}` : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
          titleColor="text2"
        />
        <Stat
          title={`Underlying ${currency0?.symbol}`}
          stat={`${token0Deposited ? parseFloat(token0Deposited?.toSignificant(6)).toLocaleString() : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
          titleColor="text2"
          currency={currency0}
        />
        <Stat
          title={`Underlying ${currency1?.symbol}`}
          stat={`${token1Deposited ? parseFloat(token1Deposited?.toSignificant(6)).toLocaleString() : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
          titleColor="text2"
          currency={currency1}
        />
      </StateContainer>
    </Box>
  )
}

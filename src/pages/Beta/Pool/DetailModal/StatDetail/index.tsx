import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { JSBI, Pair, TokenAmount, Currency } from '@pangolindex/sdk'
import { useTotalSupply } from 'src/data/TotalSupply'
import numeral from 'numeral'
import { StateContainer } from './styleds'
import Stat from 'src/components/Stat'
import { CHAINS } from 'src/constants/chains'
import { useChainId } from 'src/hooks'

interface Props {
  title: string
  totalAmount: string
  pair: Pair | null
  pgl?: TokenAmount | undefined
  currency0: Currency | undefined
  currency1: Currency | undefined
}

export default function StatDetail({ title, totalAmount, pair, pgl, currency0, currency1 }: Props) {
  const chainId = useChainId()

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)
  pgl = CHAINS[chainId].is_mainnet ? pgl : undefined

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
          titleFontSize={12}
          statFontSize={20}
          titleColor="text2"
        />
        <Stat
          title={`Underlying ${currency0?.symbol}`}
          stat={`${
            token0Deposited
              ? numeral(parseFloat(token0Deposited?.toSignificant(6))).format('0.00a')
              : '-'
          }`}
          titlePosition="top"
          titleFontSize={12}
          statFontSize={20}
          titleColor="text2"
          currency={currency0}
        />
        <Stat
          title={`Underlying ${currency1?.symbol}`}
          stat={`${
            token1Deposited
              ? numeral(parseFloat(token1Deposited?.toSignificant(6))).format('0.00a')
              : '-'
          }`}
          titlePosition="top"
          titleFontSize={12}
          statFontSize={20}
          titleColor="text2"
          currency={currency1}
        />
      </StateContainer>
    </Box>
  )
}

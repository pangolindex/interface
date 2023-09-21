import React from 'react'
import { Box, Text, Stat } from '@honeycomb-finance/core'
import { useUSDCPrice } from '@honeycomb-finance/state-hooks'
import { Currency, TokenAmount, CHAINS } from '@pangolindex/sdk'
import { StateContainer } from './styleds'
import numeral from 'numeral'
import { useChainId } from 'src/hooks'

interface Props {
  title: string
  amountInPNG: TokenAmount
  currency0: Currency | undefined
}

const StatDetails: React.FC<Props> = ({ title, amountInPNG, currency0 }) => {
  const chainId = useChainId()

  const usdcPriceTmp = useUSDCPrice(amountInPNG?.token)
  const usdcPrice = CHAINS[chainId]?.mainnet ? usdcPriceTmp : undefined
  const amountInUSD = CHAINS[chainId]?.mainnet
    ? numeral(usdcPrice?.quote(amountInPNG, chainId).toSignificant(6)).format('$0.00a')
    : undefined

  return (
    <Box>
      <Text color="text1" fontSize={[24, 18]} fontWeight={400}>
        {title}
      </Text>

      <StateContainer>
        <Stat
          title={title}
          stat={`${amountInUSD ? amountInUSD : '-'}`}
          titlePosition="top"
          titleFontSize={[16, 14]}
          statFontSize={[24, 18]}
          titleColor="text2"
        />
        <Stat
          title={`Underlying ${currency0?.symbol}`}
          stat={`${amountInPNG ? amountInPNG.toSignificant(6, { groupSeparator: ',' }) : '-'}`}
          titlePosition="top"
          titleFontSize={[16, 14]}
          statFontSize={[24, 18]}
          titleColor="text2"
          currency={currency0}
        />
      </StateContainer>
    </Box>
  )
}

export default StatDetails

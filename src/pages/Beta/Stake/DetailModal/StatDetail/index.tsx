import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { Currency, TokenAmount } from '@pangolindex/sdk'
import { StateContainer } from './styleds'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useChain, useChainId } from 'src/hooks'

interface Props {
  title: string
  amountInPNG: TokenAmount
  currency0: Currency | undefined
}

const StatDetails: React.FC<Props> = ({ title, amountInPNG, currency0 }) => {
  const chainId = useChainId()
  const chain = useChain(chainId)

  const usdcPriceTmp = useUSDCPrice(amountInPNG?.token)
  const usdcPrice = chain.mainnet ? usdcPriceTmp : undefined
  const amountInUSD = chain.mainnet
    ? numeral(usdcPrice?.quote(amountInPNG, chainId).toSignificant(6)).format('$0.00a')
    : undefined

  return (
    <Box>
      <Text color="text1" fontSize={24} fontWeight={400}>
        {title}
      </Text>

      <StateContainer>
        <Stat
          title={title}
          stat={`${amountInUSD ? amountInUSD : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
          titleColor="text2"
        />
        <Stat
          title={`Underlying ${currency0?.symbol}`}
          stat={`${amountInPNG ? amountInPNG.toSignificant(6, { groupSeparator: ',' }) : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
          titleColor="text2"
          currency={currency0}
        />
      </StateContainer>
    </Box>
  )
}

export default StatDetails

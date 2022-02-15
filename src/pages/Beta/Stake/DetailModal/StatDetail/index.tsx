import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { ChainId, Currency, TokenAmount } from '@antiyro/sdk'
import { StateContainer } from './styleds'
import numeral from 'numeral'
import Stat from 'src/components/Stat'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { useActiveWeb3React } from 'src/hooks'

interface Props {
  title: String
  amountInPNG: TokenAmount
  currency0: Currency | undefined
}

const StatDetails: React.FC<Props> = ({ title, amountInPNG, currency0 }) => {
  const usdcPrice = useUSDCPrice(amountInPNG?.token)
  const { chainId } = useActiveWeb3React()
  const amountInUSD = numeral(usdcPrice?.quote(amountInPNG, chainId || ChainId.AVALANCHE).toSignificant(6)).format('$0.00a')

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

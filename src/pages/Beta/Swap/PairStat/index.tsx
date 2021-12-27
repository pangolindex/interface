import React, { useContext } from 'react'
import { PanelWrapper } from './styleds'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
// import { ChainId, Token } from '@pangolindex/sdk'
import Stat from 'src/components/Stat'
import { ThemeContext } from 'styled-components'
import { Field } from 'src/state/swap/actions'
import { useDerivedSwapInfo } from 'src/state/swap/hooks'

const PairStat = () => {
  // const currency0 = new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
  // const currency1 = new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
  const theme = useContext(ThemeContext)

  const { currencies } = useDerivedSwapInfo()

  const inputCurrency = currencies[Field.INPUT]
  const outputCurrency = currencies[Field.OUTPUT]

  return (
    <PanelWrapper>
      <Box
        borderRight={`1px solid ${theme.text2}`}
        padding={'10px 20px'}
        display="flex"
        alignItems="center"
        height="100%"
        minWidth={275}
      >
        <DoubleCurrencyLogo size={24} currency0={inputCurrency} currency1={outputCurrency} />
        <Text color="text1" fontSize={24} fontWeight={500} lineHeight="55px" marginLeft={10}>
          {inputCurrency?.symbol}/ {outputCurrency?.symbol}
        </Text>
      </Box>
      <Box padding={10}>
        <Stat
          title={`${inputCurrency?.symbol} Price`}
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title={`${outputCurrency?.symbol} Price`}
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title={`${inputCurrency?.symbol}/${outputCurrency?.symbol}`}
          stat="80"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title={`${outputCurrency?.symbol}/${inputCurrency?.symbol}`}
          stat="0.1"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title="24H Change"
          stat="25%"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>
    </PanelWrapper>
  )
}
export default PairStat

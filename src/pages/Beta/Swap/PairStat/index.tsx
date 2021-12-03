import React, { useContext } from 'react'
import { PanelWrapper } from './styleds'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { ChainId, Token } from '@pangolindex/sdk'
import Stat from '../../../../components/Stat'
import { ThemeContext } from 'styled-components'

const PairStat = () => {
  const currency0 = new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
  const currency1 = new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
  const theme = useContext(ThemeContext)
  return (
    <PanelWrapper>
      <Box borderRight={`1px solid ${theme.text2}`} padding={10} display="flex" alignItems="center">
        <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
        <Text color="text1" fontSize={24} fontWeight={500} lineHeight="55px" marginLeft={10}>
          AVAX/PNG
        </Text>
      </Box>
      <Box padding={10}>
        <Stat
          title="AVAX Price"
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title="PNG Price"
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title="AVAX/PNG"
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title="PNG/AVAX"
          stat="80.06$"
          titlePosition="top"
          titleFontSize={16}
          statFontSize={26}
          titleColor="text2"
        />
      </Box>

      <Box padding={10}>
        <Stat
          title="24H Change"
          stat="80.06$"
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

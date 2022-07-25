import { CurrencyLogo, Text } from '@pangolindex/components'
import React from 'react'
import Stat from 'src/components/Stat'
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'
import { DestkopDetails, MobileDetails, Title, Wrapper } from './styleds'

const StakeStat: React.FC = () => {
  const chainId = useChainId()
  return (
    <Wrapper>
      <Title>
        <CurrencyLogo currency={PNG[chainId]} size={48} />
        <Text color="text1" fontSize="24px">
          {PNG[chainId].symbol} Single Stake
        </Text>
      </Title>

      <DestkopDetails upToSmall={true}>
        <Stat
          title="Your Stake"
          titlePosition="top"
          stat="0.00"
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={24}
        />
        <Stat
          title="Your Avarege APR"
          titlePosition="top"
          stat="0.00"
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={24}
        />
        <Stat
          title="Total PNG"
          titlePosition="top"
          stat="0.00"
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={24}
        />
        <Stat
          title="APR"
          titlePosition="top"
          stat="25%"
          titleColor="text2"
          statColor="text1"
          titleFontSize={16}
          statFontSize={24}
        />
      </DestkopDetails>
      <MobileDetails upToSmall={true}>
        <Stat
          title="APR"
          titlePosition="top"
          stat="25%"
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

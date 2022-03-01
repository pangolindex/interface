import React from 'react'
import { ChainId } from '@pangolindex/sdk'
import { MobileWrapper, DesktopWrapper, DetailsWrapper, Tab, Tabs, LeftSection, RightSection } from './styleds'
import { StakingInfo } from 'src/state/stake/hooks'
import { Box } from '@pangolindex/components'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { usePair } from 'src/data/Reserves'
import EarnWidget from '../../EarnWidget'
import EarnDetail from '../EarnDetail'
import { useWindowSize } from 'react-use'
import { useActiveWeb3React } from 'src/hooks'
import Header from '../Header'
import Details from '../Details'

export interface PoolDetailProps {
  onDismiss: () => void
  stakingInfo: StakingInfo
  version: number
}

const DetailView = ({ stakingInfo, onDismiss, version }: PoolDetailProps) => {
  const { height } = useWindowSize()

  const token0 = stakingInfo?.tokens[0]
  const token1 = stakingInfo?.tokens[1]
  const { chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(token0, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(token1, chainId || ChainId.AVALANCHE)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))


  const [, stakingTokenPair] = usePair(token0, token1)
  const pair = stakingTokenPair

  return (
    <>
      <MobileWrapper>
        <Header stakingInfo={stakingInfo} onClose={onDismiss} />
        <Box p={10}>
          {isStaking && <EarnDetail stakingInfo={stakingInfo} version={version} />}
          <Box mt={isStaking ? '10px' : '0px'}>
            <EarnWidget currencyA={currency0} currencyB={currency1} version={version} pair={pair} />
          </Box>

          <Box mt={25}>
            <Tabs>
              <Tab>Details</Tab>
            </Tabs>
            <Details stakingInfo={stakingInfo} />
          </Box>
        </Box>
      </MobileWrapper>
      <DesktopWrapper style={{ maxHeight: height - 150 }}>
        <Header stakingInfo={stakingInfo} onClose={onDismiss} />
        <DetailsWrapper>
          <LeftSection>
            <Tabs>
              <Tab>Details</Tab>
            </Tabs>
            <Details stakingInfo={stakingInfo} />
          </LeftSection>
          <RightSection>
            <EarnWidget currencyA={currency0} currencyB={currency1} version={version} pair={pair} />
            {isStaking && <EarnDetail stakingInfo={stakingInfo} version={version} />}
          </RightSection>
        </DetailsWrapper>
      </DesktopWrapper>
    </>
  )
}
export default DetailView

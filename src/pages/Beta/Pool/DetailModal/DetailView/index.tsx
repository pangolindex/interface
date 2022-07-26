import React from 'react'
import { MobileWrapper, DesktopWrapper, DetailsWrapper, Tab, Tabs, LeftSection, RightSection } from './styleds'
import { StakingInfo } from 'src/state/stake/hooks'
import { Box } from '@pangolindex/components'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import EarnWidget from '../../EarnWidget'
import EarnDetail from '../EarnDetail'
import { useWindowSize } from 'react-use'
import Header from '../Header'
import Details from '../Details'
import { useChainId } from 'src/hooks'

export interface PoolDetailProps {
  onDismiss: () => void
  stakingInfo: StakingInfo
  version: number
}

const DetailView = ({ stakingInfo, onDismiss, version }: PoolDetailProps) => {
  const { height } = useWindowSize()
  const chainId = useChainId()

  const token0 = stakingInfo?.tokens[0]
  const token1 = stakingInfo?.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  const isStaking = Boolean(stakingInfo?.stakedAmount?.greaterThan('0'))

  return (
    <>
      <MobileWrapper>
        <Header stakingInfo={stakingInfo} onClose={onDismiss} />
        <Box p={10}>
          {isStaking && <EarnDetail stakingInfo={stakingInfo} version={version} />}
          <Box mt={isStaking ? '10px' : '0px'}>
            <EarnWidget currencyA={currency0} currencyB={currency1} version={version} stakingInfo={stakingInfo} />
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
            <EarnWidget currencyA={currency0} currencyB={currency1} version={version} stakingInfo={stakingInfo} />
            {isStaking && <EarnDetail stakingInfo={stakingInfo} version={version} />}
          </RightSection>
        </DetailsWrapper>
      </DesktopWrapper>
    </>
  )
}
export default DetailView

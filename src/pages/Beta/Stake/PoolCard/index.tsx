import React from 'react'
import { Card, CardHeader, CardStats, CardButtons, TokenName, Label, Value, DetailButton, StakeButton } from './styleds'

export interface PoolCardProps {
  token: string
}

const tokens = {
  Wavax: {
    address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
  },
  Apein: {
    address: '0x938FE3788222A74924E062120E7BFac829c719Fb'
  },
  Orbs: {
    address: '0x340fE1D898ECCAad394e2ba0fC1F93d27c7b717A'
  }
}

const PoolCard = ({ token }: PoolCardProps) => {
  const imagePath = `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${
    (tokens as any)[token].address
  }/logo.png`

  return (
    <Card>
      <CardHeader>
        <TokenName>Earn {token}</TokenName>
        <div>
          <img src={imagePath} width="58" alt={`${token} logo`} />
        </div>
      </CardHeader>
      <CardStats>
        <div>
          <Label>Total Staked</Label>
          <Value>$25.5K</Value>
        </div>
        <div>
          <Label>Annual Percentage Rate</Label>
          <Value>75.23%</Value>
        </div>
      </CardStats>
      <CardButtons>
        <DetailButton variant="outline">SEE DETAILS</DetailButton>
        <StakeButton variant="primary">STAKE</StakeButton>
      </CardButtons>
    </Card>
  )
}
export default PoolCard

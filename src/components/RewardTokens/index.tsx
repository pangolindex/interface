import { ChainId, Token } from '@pangolindex/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface RewardTokensLogoProps {
  margin?: boolean
  size?: number
  rewardTokens?: Array<Token>
}

const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

const currency0 = new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
const currency1 = new Token(ChainId.AVALANCHE, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')

export default function RewardTokens({
  rewardTokens = [currency0, currency1, currency0],
  size = 16,
  margin = false
}: RewardTokensLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {rewardTokens.map((rewardToken, i) => {
        return <CoveredLogo key={i} currency={rewardToken} size={size.toString() + 'px'} sizeraw={size} />
      })}
    </Wrapper>
  )
}

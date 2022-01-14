import { Token } from '@pangolindex/sdk'
import React from 'react'
import styled from 'styled-components'
import { useTokens } from '../../hooks/Tokens'
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
  rewardTokens?: Array<string>
}

const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function RewardTokens({ rewardTokens = [], size = 16, margin = false }: RewardTokensLogoProps) {
  const tokens = useTokens(rewardTokens)

  return (
    <Wrapper sizeraw={size} margin={margin}>
      {(tokens || []).map((token, i) => {
        return <CoveredLogo key={i} currency={token as Token} size={size.toString() + 'px'} sizeraw={size} />
      })}
    </Wrapper>
  )
}

import { Token } from '@pangolindex/sdk'
import React from 'react'
import { LogoSize } from 'src/constants'
import styled from 'styled-components'
import { PNG } from '../../constants/tokens'
import { CurrencyLogo } from '@pangolindex/components'
import { useChainId } from 'src/hooks'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface RewardTokensLogoProps {
  margin?: boolean
  size?: LogoSize
  rewardTokens?: Array<Token | null | undefined> | null
}

const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function RewardTokens({ rewardTokens = [], size = 24, margin = false }: RewardTokensLogoProps) {
  const chainId = useChainId()
  const tokens = [PNG[chainId], ...(rewardTokens || [])] // add PNG as default reward

  return (
    <Wrapper sizeraw={size} margin={margin}>
      {(tokens || []).map((token, i) => {
        return <CoveredLogo key={i} currency={token as Token} size={size} sizeraw={size} imageSize={48} />
      })}
    </Wrapper>
  )
}

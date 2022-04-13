import { Currency } from '@antiyro/sdk'
import React from 'react'
import { useChainId } from 'src/hooks'
import { LogoSize } from 'src/constants'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: LogoSize
  currency0?: Currency
  currency1?: Currency
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 24,
  margin = false
}: DoubleCurrencyLogoProps) {
  const chainId = useChainId()
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <HigherLogo currency={currency0} size={size} chainId={chainId} />}
      {currency1 && <CoveredLogo currency={currency1} size={size} sizeraw={size} chainId={chainId} />}
    </Wrapper>
  )
}

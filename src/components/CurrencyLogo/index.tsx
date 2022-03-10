import { Currency, CAVAX, Token } from '@pangolindex/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { getTokenLogoURL_24_24, getTokenLogoURL_48_48 } from '../../constants'

export const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === CAVAX) return []

    if (currency instanceof Token) {
      // Javascript will parse 'XXpx' or 'XXrem' as XX
      const logoSizeFloat = parseFloat(size)
      const primarySrc =
        isNaN(logoSizeFloat) || logoSizeFloat <= 24
          ? getTokenLogoURL_24_24(currency.address)
          : getTokenLogoURL_48_48(currency.address)
      return [primarySrc, ...uriLocations]
    }

    return []
  }, [currency, uriLocations, size])

  if (currency === CAVAX) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

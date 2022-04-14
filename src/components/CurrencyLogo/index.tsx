import { Currency, CAVAX, Token, ChainId } from '@pangolindex/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import WgmLogo from '../../assets/images/wgmlogo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { getTokenLogoURL, LogoSize } from '../../constants'

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
  chainId,
  currency,
  size = 24,
  style,
  imageSize = size
}: {
  chainId: ChainId
  currency?: Currency
  size?: LogoSize
  style?: React.CSSProperties
  imageSize?: LogoSize
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (chainId && currency === CAVAX[chainId]) return []

    if (currency instanceof Token) {
      const primarySrc = getTokenLogoURL(currency.address, imageSize)
      return [primarySrc, ...uriLocations]
    }

    return []
  }, [chainId, currency, uriLocations, imageSize])

  if (chainId && currency === CAVAX[ChainId.AVALANCHE]) {
    return <StyledEthereumLogo src={AvaxLogo} size={`${size}px`} style={style} />
  } else if (chainId && currency === CAVAX[ChainId.FUJI]) {
    return <StyledEthereumLogo src={AvaxLogo} size={`${size}px`} style={style} />
  } else if (chainId && currency === CAVAX[ChainId.WAGMI]) {
    return <StyledEthereumLogo src={WgmLogo} size={`${size}px`} style={style} />
  } else if (chainId && currency === CAVAX[ChainId.COSTON]) {
    return <StyledEthereumLogo src={WgmLogo} size={`${size}px`} style={style} />
  }

  return <StyledLogo size={`${size}px`} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

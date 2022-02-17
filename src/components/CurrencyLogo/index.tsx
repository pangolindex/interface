import { Currency, CAVAX, Token, ChainId } from '@antiyro/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import WgmLogo from '../../assets/images/wgmlogo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) =>
`https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png`
// `https://raw.githubusercontent.com/jb1011/test/master/assets/${address}/logo.png`
  

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
  size = '24px',
  style
}: {
  chainId: ChainId
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (chainId && currency === CAVAX[chainId]) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [...uriLocations, getTokenLogoURL(currency.address)]
    }
    return []
  }, [chainId, currency, uriLocations])

  if (chainId && currency === CAVAX[ChainId.AVALANCHE]) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }
  else if (chainId && currency === CAVAX[ChainId.FUJI]) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }
  else if (chainId && currency === CAVAX[ChainId.WAGMI]) {
    return <StyledEthereumLogo src={WgmLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

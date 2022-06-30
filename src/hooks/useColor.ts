import { useState, useLayoutEffect } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { Token } from '@pangolindex/sdk'
import { getTokenLogoURL } from '../constants'
import { useChainId } from 'src/hooks'

async function getColorFromToken(token: Token, chainId: number): Promise<string | null> {
  const path = getTokenLogoURL(token.address, chainId)

  return Vibrant.from(path)
    .getPalette()
    .then(palette => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const [color, setColor] = useState('#2172E5')
  const chainId = useChainId()

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token, chainId).then(tokenColor => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [token, chainId])

  return color
}

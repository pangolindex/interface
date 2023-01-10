import { useCallback } from 'react'
import {
  useMixpanel as useComponentMixpanel,
  MixPanelEvents as ComponentsMixPanelEvents
} from '@pangolindex/components'

export enum MixPanelEvents {
  CLAIM_AIRDROP = 'Claimed Airdrop'
}

export function useMixpanel() {
  const { track } = useComponentMixpanel()

  const overrideTrack = useCallback(
    (event: MixPanelEvents | ComponentsMixPanelEvents, properties: { [x: string]: any }) => {
      track(event as any, { source: 'interface', ...properties })
    },
    [track]
  )

  return { track: overrideTrack }
}

import { useCallback } from 'react'
import {
  useMixpanel as useComponentMixpanel,
  MixPanelEvents as ComponentsMixPanelEvents
} from '@honeycomb-finance/shared'

export enum MixPanelEvents {}

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

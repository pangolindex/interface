import mixpanel from 'mixpanel-browser'
import React, { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface MixPanelProviderProps {
  children: ReactNode
  mixpanelToken?: string
}

type MixPanelContextType = {
  track: (event: string, properties: { [x: string]: any }) => void
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const dummyTrack = (event: string, properties: { [x: string]: any }) => {
  // This is intentional
}

export const MixPanelContext = createContext<MixPanelContextType>({ track: dummyTrack })

export const MixPanelProvider: FC<MixPanelProviderProps> = ({ children, mixpanelToken }: MixPanelProviderProps) => {
  const [activedMixPanel, setActivedMixPanel] = useState(false)

  useEffect(() => {
    if (mixpanelToken) {
      try {
        mixpanel.init(mixpanelToken)
        setActivedMixPanel(true)
      } catch (error) {
        console.error('Error activating Mixpanel: ', error)
      }
    }
  }, [])

  const track = useCallback((event: string, properties: { [x: string]: any }) => {
    mixpanel.track(event, { ...properties, source: 'interface' })
  }, [])

  const state: MixPanelContextType = useMemo(() => {
    return {
      track: activedMixPanel ? track : dummyTrack
    }
  }, [activedMixPanel])

  return <MixPanelContext.Provider value={state}>{children}</MixPanelContext.Provider>
}

export function useMixpanel() {
  return useContext(MixPanelContext)
}

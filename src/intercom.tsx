import React, { useEffect } from 'react'

interface IntercomProps {
  appID: string
  onMessengerOpen?: () => void
  onMessengerHide?: () => void
}

const Intercom: React.FC<IntercomProps> = ({ appID, onMessengerOpen, onMessengerHide }) => {
  useEffect(() => {
    ;(window as any).Intercom('boot', {
      app_id: appID
    })
    if (onMessengerOpen) {
      ;(window as any).Intercom('onShow', onMessengerOpen)
    }
    if (onMessengerHide) {
      ;(window as any).Intercom('onHide', onMessengerHide)
    }
  }, [appID, onMessengerOpen, onMessengerHide])

  useEffect(() => {
    return () => {
      ;(window as any).Intercom('shutdown')
    }
  }, [])

  return null
}

export default Intercom

import React, { useEffect } from 'react'

interface IntercomProps {
  appID: string
  walletAddress?: string
  onMessengerOpen?: () => void
  onMessengerHide?: () => void
}

const Intercom: React.FC<IntercomProps> = ({ appID, walletAddress, onMessengerOpen, onMessengerHide }) => {
  useEffect(() => {
    ;(window as any).Intercom('boot', {
      app_id: appID,
      ...(walletAddress && { user_id: walletAddress })
    })
    if (onMessengerOpen && !walletAddress) {
      ;(window as any).Intercom('onShow', onMessengerOpen)
    }
    if (onMessengerHide && !walletAddress) {
      ;(window as any).Intercom('onHide', onMessengerHide)
    }
  }, [appID, walletAddress, onMessengerOpen, onMessengerHide])

  useEffect(() => {
    return () => {
      ;(window as any).Intercom('shutdown')
    }
  }, [])

  return null
}

export default Intercom

import React from 'react'
import { Button, useTranslation } from '@pangolindex/components'
import { useWalletModalToggle } from 'src/state/application/hooks'

export const ButtonToConnect = () => {
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  return (
    <Button variant="primary" color="black" height="46px" onClick={toggleWalletModal}>
      {t('swapPage.connectWallet')}
    </Button>
  )
}

export default [ButtonToConnect]

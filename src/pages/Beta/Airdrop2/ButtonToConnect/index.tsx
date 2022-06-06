import React from 'react'
import { Button } from '@pangolindex/components'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useTranslation } from 'react-i18next'

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

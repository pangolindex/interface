import React from 'react'
import { Button } from '@0xkilo/components'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useTranslation } from 'react-i18next'

export const ButtonToConnect = () => {
    const toggleWalletModal = useWalletModalToggle()
    const { t } = useTranslation()
    return (
        <Button variant="primary" color='white' height='46px' onClick={toggleWalletModal}>
            <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>{t('swapPage.connectWallet')}</span>
        </Button>
    )
}

export const ButtonClaimReward = () => {
    return (
        <Button variant="primary" color='white' height='46px'>
            <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>CLAIM</span>
        </Button>
    )
}

export default [ButtonToConnect, ButtonClaimReward]


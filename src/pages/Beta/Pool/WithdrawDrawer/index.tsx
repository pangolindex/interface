import React from 'react'
import Drawer from 'src/components/Drawer'
import { StakingInfo } from 'src/state/stake/hooks'
import { useTranslation } from 'react-i18next'
import Withdraw from '../Withdraw'

type Props = {
  isOpen: boolean
  stakingInfo: StakingInfo
  onClose: () => void
  version: number
}

const WithdrawDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo, version }) => {
  const { t } = useTranslation()
  return (
    <Drawer title={t('earn.withdrawAndClaim')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <Withdraw stakingInfo={stakingInfo} onClose={onClose} version={version} />}
    </Drawer>
  )
}

export default WithdrawDrawer

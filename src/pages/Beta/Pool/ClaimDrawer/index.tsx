import React from 'react'
import Drawer from 'src/components/Drawer'
import { StakingInfo } from 'src/state/stake/hooks'
import { useTranslation } from 'react-i18next'
import ClaimReward from '../ClaimReward'

type Props = {
  isOpen: boolean
  stakingInfo: StakingInfo
  onClose: () => void
  version: number
}

const ClaimDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo, version }) => {
  const { t } = useTranslation()
  return (
    <Drawer title={t('earn.claim')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <ClaimReward stakingInfo={stakingInfo} onClose={onClose} version={version} />}
    </Drawer>
  )
}

export default ClaimDrawer

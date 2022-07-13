import React from 'react'
import Drawer from 'src/components/Drawer'
import { StakingInfo } from 'src/state/stake/hooks'
import ClaimReward from '../ClaimReward'
import { useTranslation } from '@pangolindex/components'

type Props = {
  isOpen: boolean
  stakingInfo: StakingInfo
  onClose: () => void
  version: number
  backgroundColor?: string
}

const ClaimDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo, version, backgroundColor }) => {
  const { t } = useTranslation()
  return (
    <Drawer title={t('earn.claim')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && <ClaimReward stakingInfo={stakingInfo} onClose={onClose} version={version} />}
    </Drawer>
  )
}

export default ClaimDrawer

import React from 'react'
import Drawer from 'src/components/Drawer'
import { useTranslation } from '@pangolindex/components'
import Stake from '../EarnWidget/Stake'
import { StakingInfo } from 'src/state/stake/hooks'

type Props = {
  isOpen: boolean
  onClose: () => void
  backgroundColor?: string
  version: number
  stakingInfo: StakingInfo
  combinedApr?: number
}

const FarmDrawer: React.FC<Props> = ({ isOpen, onClose, backgroundColor, version, stakingInfo, combinedApr }) => {
  const { t } = useTranslation()

  return (
    <Drawer title={t('earn.deposit')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && (
        <Stake version={version} onComplete={onClose} type="card" stakingInfo={stakingInfo} combinedApr={combinedApr} />
      )}
    </Drawer>
  )
}

export default FarmDrawer

import React from 'react'
import Drawer from 'src/components/Drawer'
import { useTranslation } from 'react-i18next'
import Stake from '../EarnWidget/Stake'
import { StakingInfo } from 'src/state/stake/hooks'

type Props = {
  isOpen: boolean
  onClose: () => void
  backgroundColor?: string
  version: number
  stakingInfo: StakingInfo
}

const FarmDrawer: React.FC<Props> = ({ isOpen, onClose, backgroundColor, version, stakingInfo }) => {
  const { t } = useTranslation()

  return (
    <Drawer title={t('earn.deposit')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && <Stake version={version} onComplete={onClose} type="card" stakingInfo={stakingInfo} />}
    </Drawer>
  )
}

export default FarmDrawer

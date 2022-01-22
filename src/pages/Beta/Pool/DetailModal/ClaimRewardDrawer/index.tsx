import React from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from '../../../components/Drawer'
import ClaimReward from '../../ClaimReward'
import { StakingInfo } from 'src/state/stake/hooks'

interface Props {
  isOpen: boolean
  version: number
  onClose: () => void
  stakingInfo: StakingInfo
}

const ConfirmStakeDrawer: React.FC<Props> = props => {
  const { isOpen, onClose, stakingInfo, version } = props
  const { t } = useTranslation()

  return (
    <Drawer title={t('earn.claim')} isOpen={isOpen} onClose={onClose}>
      <ClaimReward version={version} stakingInfo={stakingInfo} onClose={onClose} />
    </Drawer>
  )
}
export default ConfirmStakeDrawer

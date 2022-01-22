import React from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from '../../../components/Drawer'
import Withdraw from '../../Withdraw'
import { StakingInfo } from 'src/state/stake/hooks'

interface Props {
  isOpen: boolean
  version: number
  onClose: () => void
  stakingInfo: StakingInfo
}

const WithdrawDrawer: React.FC<Props> = props => {
  const { isOpen, onClose, stakingInfo, version } = props
  const { t } = useTranslation()

  return (
    <Drawer title={t('earn.withdrawAndClaim')} isOpen={isOpen} onClose={onClose}>
      <Withdraw version={version} stakingInfo={stakingInfo} onClose={onClose} />
    </Drawer>
  )
}
export default WithdrawDrawer

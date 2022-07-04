import React from 'react'
import Drawer from 'src/components/Drawer'
import { StakingInfo } from 'src/state/stake/hooks'
import { useTranslation } from 'react-i18next'
import Remove from '../Remove'

type Props = {
  isOpen: boolean
  stakingInfo: StakingInfo
  onClose: () => void
  version: number
}

const RemoveDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo, version }) => {
  const { t } = useTranslation()
  return (
    <Drawer title={t('removeLiquidity.remove')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <Remove stakingInfo={stakingInfo} onClose={onClose} version={version} />}
    </Drawer>
  )
}

export default RemoveDrawer

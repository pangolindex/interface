import React from 'react'
import Drawer from 'src/components/Drawer'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import StakeWidet from '../StakeWidget'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const StakeDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const { t } = useTranslation()
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('earnPage.stake')}>
      {isOpen && <StakeWidet stakingInfo={stakingInfo} onClose={onClose} />}
    </Drawer>
  )
}

export default StakeDrawer

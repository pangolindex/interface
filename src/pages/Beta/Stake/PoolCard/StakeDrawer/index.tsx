import React from 'react'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import StakeWidet from '../StakeWidget'
import { useTranslation } from '@honeycomb-finance/shared'
import { Drawer } from '@honeycomb-finance/core'

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

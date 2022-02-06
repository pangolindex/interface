import React from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from 'src/components/Drawer'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import DepositWidget from '../../DepositWidget'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const DepositDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const { t } = useTranslation()

  return (
    <Drawer title={t('earnPage.deposit')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <DepositWidget stakingInfo={stakingInfo} onClose={onClose} />}
    </Drawer>
  )
}

export default DepositDrawer

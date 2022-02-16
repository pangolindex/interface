import React from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from 'src/components/Drawer'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import ClaimWidget from '../ClaimWidget'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const ClaimDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const { t } = useTranslation()

  return (
    <Drawer title={t('earn.claim')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <ClaimWidget stakingInfo={stakingInfo} onClose={onClose} />}
    </Drawer>
  )
}

export default ClaimDrawer

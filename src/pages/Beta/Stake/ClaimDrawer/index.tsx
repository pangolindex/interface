import React from 'react'
import Drawer from 'src/components/Drawer'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import ClaimWidget from '../ClaimWidget'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
  onClickRewardStake: () => void
}

const ClaimDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo, onClickRewardStake }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      {isOpen && <ClaimWidget stakingInfo={stakingInfo} onClose={onClose} onClickRewardStake={onClickRewardStake} />}
    </Drawer>
  )
}

export default ClaimDrawer

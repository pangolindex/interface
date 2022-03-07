import React from 'react'
import Drawer from 'src/components/Drawer'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import StakeWidget from '../DetailModal/StakeWidget'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const RewardStakeDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  return (
    <Drawer title="Stake Reward" isOpen={isOpen} onClose={onClose}>
      {isOpen && <StakeWidget stakingInfo={stakingInfo} onClose={onClose} isRewardStake={true} />}
    </Drawer>
  )
}

export default RewardStakeDrawer

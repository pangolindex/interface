import React from 'react'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import StakeWidget from '../DetailModal/StakeWidget'
import { Drawer } from '@honeycomb-finance/core'
import { useTranslation } from '@honeycomb-finance/shared'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const RewardStakeDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const { t } = useTranslation()
  return (
    <Drawer title={t('stakePage.stakeReward')} isOpen={isOpen} onClose={onClose}>
      {isOpen && <StakeWidget stakingInfo={stakingInfo} onClose={onClose} isRewardStake={true} />}
    </Drawer>
  )
}

export default RewardStakeDrawer

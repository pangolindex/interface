import React, { useCallback, useState } from 'react'
import { Box, Drawer } from '@pangolindex/components'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import ClaimWidget from '../ClaimWidget'
import RewardStakeDrawer from '../RewardStakeDrawer'

type Props = {
  isOpen: boolean
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const ClaimDrawer: React.FC<Props> = ({ isOpen, onClose, stakingInfo }) => {
  const [isRewardStakeDrawerVisible, setShowRewardStakeDrawer] = useState(false)

  const onCloseRewardStakeDrawer = useCallback(() => {
    setShowRewardStakeDrawer(false)
    onClose()
  }, [onClose])

  return (
    <Box>
      <Drawer isOpen={isOpen} onClose={onClose}>
        {isOpen && (
          <ClaimWidget
            stakingInfo={stakingInfo}
            onClose={onClose}
            onClickRewardStake={() => setShowRewardStakeDrawer(true)}
          />
        )}
      </Drawer>

      <RewardStakeDrawer
        isOpen={isRewardStakeDrawerVisible}
        onClose={onCloseRewardStakeDrawer}
        stakingInfo={stakingInfo}
      />
    </Box>
  )
}

export default ClaimDrawer

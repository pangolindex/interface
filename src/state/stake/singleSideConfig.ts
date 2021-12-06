import { ChainId, WAVAX } from '@pangolindex/sdk'
import { OOE, APEIN } from '../../constants'
import { SingleSideStaking } from './hooks'


export const SINGLE_SIDE_STAKING: { [key: string]: SingleSideStaking } = {
  WAVAX_V0: {
    rewardToken: WAVAX[ChainId.AVALANCHE],
    conversionRouteHops: [],
    stakingRewardAddress: '0xD49B406A7A29D64e081164F6C3353C599A2EeAE9',
    version: 0
  },
  OOE_V0: {
    rewardToken: OOE[ChainId.AVALANCHE],
    conversionRouteHops: [WAVAX[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xf0eFf017644680B9878429137ccb2c041b4Fb701',
    version: 0
  },
  APEIN_V0: {
    rewardToken: APEIN[ChainId.AVALANCHE],
    conversionRouteHops: [WAVAX[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xfe1d712363f2B1971818DBA935eEC13Ddea474cc',
    version: 0
  }
}

export const SINGLE_SIDE_STAKING_V0: SingleSideStaking[] = Object.values(SINGLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const SINGLE_SIDE_STAKING_REWARDS_CURRENT_VERSION = Math.max(
  ...Object.values(SINGLE_SIDE_STAKING).map(staking => staking.version)
)

export const SINGLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: SingleSideStaking[][]
} = {
  [ChainId.AVALANCHE]: [SINGLE_SIDE_STAKING_V0]
}

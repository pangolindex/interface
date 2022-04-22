import { Interface } from '@ethersproject/abi'
import StakingRewards from '@pangolindex/governance/artifacts/contracts/StakingRewards.sol/StakingRewards.json'

const STAKING_REWARDS_INTERFACE = new Interface(StakingRewards.abi)

export { STAKING_REWARDS_INTERFACE }

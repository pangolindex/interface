import { Contract } from '@ethersproject/contracts'
import { ChainId, WAVAX } from '@antiyro/sdk'
import { abi as IPangolinPairABI } from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinPair.sol/IPangolinPair.json'
import { abi as STAKING_REWARDS_ABI } from '@pangolindex/governance/artifacts/contracts/StakingRewards.sol/StakingRewards.json'
import { abi as AIRDROP_ABI } from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import { abi as GOVERNANCE_ABI } from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import { abi as PNG_ABI } from '@pangolindex/governance/artifacts/contracts/PNG.sol/Png.json'
import { abi as BRIDGE_MIGRATOR_ABI } from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-periphery/PangolinBridgeMigrationRouter.sol/PangolinBridgeMigrationRouter.json'
import { abi as MINICHEF_ABI } from '@pangolindex/governance/artifacts/contracts/MiniChefV2.sol/MiniChefV2.json'
import { useMemo } from 'react'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import BRIDGE_TOKEN_ABI from '../constants/abis/bridge-token.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { AIRDROP_ADDRESS, BRIDGE_MIGRATOR_ADDRESS, MINICHEF_ADDRESS } from '../constants'
import { GOVERNANCE_ADDRESS, PNG } from '../constants'
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from '../constants/abis/rewarderViaMultiplier'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useMiniChefContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(MINICHEF_ADDRESS[chainId || ChainId.AVALANCHE], MINICHEF_ABI, true)
}

export function useBridgeMigratorContract(): Contract | null {
  return useContract(BRIDGE_MIGRATOR_ADDRESS, BRIDGE_MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBridgeTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, BRIDGE_TOKEN_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WAVAX[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IPangolinPairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true)
}

export function usePngContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? PNG[chainId].address : undefined, PNG_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(stakingAddress, stakingAddress === MINICHEF_ADDRESS[chainId || ChainId.AVALANCHE] ? MINICHEF_ABI : STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useRewardViaMultiplierContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, REWARDER_VIA_MULTIPLIER_INTERFACE, withSignerIfPossible)
}

export function useAirdropContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? AIRDROP_ADDRESS[chainId] : undefined, AIRDROP_ABI, true)
}

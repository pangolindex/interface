import { Contract } from '@ethersproject/contracts'
import IPangolinPair from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinPair.sol/IPangolinPair.json'
import StakingRewards from '@pangolindex/governance/artifacts/contracts/StakingRewards.sol/StakingRewards.json'
import Airdrop from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import MerkleAirdrop from 'src/constants/abis/Merkledrop.json'
import GovernorAlpha from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import Png from '@pangolindex/governance/artifacts/contracts/PNG.sol/Png.json'
import MiniChefV2 from '@pangolindex/governance/artifacts/contracts/MiniChefV2.sol/MiniChefV2.json'
import { useMemo } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { AIRDROP_ADDRESS, MINICHEF_ADDRESS, ZERO_ADDRESS, GOVERNANCE_ADDRESS, MERKLEDROP_ADDRESS } from '../constants'
import { PNG } from '../constants/tokens'
import { useLibrary } from '@pangolindex/components'
import { useChainId } from 'src/hooks'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { account } = useActiveWeb3React()
  const { library } = useLibrary()

  return useMemo(() => {
    if (!address || address === ZERO_ADDRESS || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IPangolinPair.abi, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const chainId = useChainId()
  return useContract(MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GovernorAlpha.abi, true)
}

export function usePngContract(): Contract | null {
  const chainId = useChainId()
  return useContract(chainId ? PNG[chainId].address : undefined, Png.abi, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  const chainId = useChainId()
  return useContract(
    stakingAddress,
    stakingAddress === MINICHEF_ADDRESS[chainId] ? MiniChefV2.abi : StakingRewards.abi,
    withSignerIfPossible
  )
}

export function useAirdropContract(): Contract | null {
  const chainId = useChainId()
  return useContract(chainId ? AIRDROP_ADDRESS[chainId] : undefined, Airdrop.abi, true)
}

export const useMerkledropContract = () => {
  const chainId = useChainId()
  return useContract(MERKLEDROP_ADDRESS[chainId], MerkleAirdrop.abi, true)
}

import { Contract } from '@ethersproject/contracts'
import Airdrop from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import GovernorAlpha from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import { AIRDROP_ADDRESS, GOVERNANCE_ADDRESS } from '../constants'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useContract } from '@pangolindex/components'
import { useChainId } from 'src/hooks'
import { AirdropType } from '@pangolindex/sdk'
import { airdropAbiMapping } from 'src/constants/airdrop'

// returns null on errors

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GovernorAlpha.abi, true)
}

export function useAirdropContract(): Contract | null {
  const chainId = useChainId()
  return useContract(chainId ? AIRDROP_ADDRESS[chainId] : undefined, Airdrop.abi, true)
}

export const useMerkledropContract = (address: string, type: AirdropType) => {
  const abi = airdropAbiMapping[type]
  return useContract(address, abi, true)
}

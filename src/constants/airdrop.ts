import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'
import Airdrop from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import MerkleAirdrop from 'src/constants/abis/Merkledrop.json'
import MerkleAirdropCompliant from 'src/constants/abis/MerkledropCompliant.json'
import { NEAR_MAINNET, FLARE_MAINNET, ChainId, AirdropType, CHAINS } from '@pangolindex/sdk'

export interface AirdropData {
  address: string
  active: boolean
  type: AirdropType
  title?: string
}

export const activeAirdrops: { [chainId in ChainId]?: AirdropData } = {
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD]!.contracts!.airdrop,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON]!.contracts!.airdrop
}

export const specialAirdrops: { [chainId in ChainId]?: AirdropData[] } = {
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD]!.contracts!.specialAirdrops
}

export const commingSoonAirdrops = [NEAR_MAINNET, FLARE_MAINNET]

export const logoMapping = {
  [ChainId.COSTON]: PNG,
  [ChainId.SONGBIRD]: PSB,
  [ChainId.FUJI]: PNG,
  [ChainId.AVALANCHE]: PNG,
  [ChainId.WAGMI]: PNG,
  14: PNG, // Don't have flare on chain id mapping
  [ChainId.NEAR_MAINNET]: PNR,
  [ChainId.NEAR_TESTNET]: PNR
}

export const airdropAbi = {
  [AirdropType.LEGACY]: Airdrop.abi,
  [AirdropType.MERKLE]: MerkleAirdrop.abi,
  [AirdropType.MERKLE_TO_STAKING]: MerkleAirdrop.abi,
  [AirdropType.MERKLE_TO_STAKING_COMPLIANT]: MerkleAirdropCompliant.abi,
  [AirdropType.NEAR_AIRDROP]: undefined
}

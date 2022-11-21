import { CHAINS, ChainId } from '@pangolindex/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.multicall,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.multicall,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.multicall,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.multicall,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].contracts!.multicall,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].contracts!.multicall,
  [ChainId.NEAR_MAINNET]: '',
  [ChainId.NEAR_TESTNET]: ''
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

import { CHAINS, ChainId } from '@pangolindex/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: CHAINS[ChainId.FUJI].contracts!.multicall,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.multicall,
  [ChainId.WAGMI]: CHAINS[ChainId.WAGMI].contracts!.multicall,
  [ChainId.COSTON]: CHAINS[ChainId.COSTON].contracts!.multicall,
  [ChainId.SONGBIRD]: CHAINS[ChainId.SONGBIRD].contracts!.multicall,
  [ChainId.FLARE_MAINNET]: CHAINS[ChainId.FLARE_MAINNET].contracts!.multicall,
  [ChainId.HEDERA_TESTNET]: CHAINS[ChainId.HEDERA_TESTNET].contracts!.multicall,
  [ChainId.NEAR_MAINNET]: '',
  [ChainId.NEAR_TESTNET]: '',
  [ChainId.COSTON2]: CHAINS[ChainId.COSTON2].contracts!.multicall,
  [ChainId.ETHEREUM]: '',
  [ChainId.POLYGON]: '',
  [ChainId.FANTOM]: '',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.CELO]: '',
  [ChainId.OKXCHAIN]: '',
  [ChainId.VELAS]: '',
  [ChainId.AURORA]: '',
  [ChainId.CRONOS]: '',
  [ChainId.FUSE]: '',
  [ChainId.MOONRIVER]: '',
  [ChainId.MOONBEAM]: '',
  [ChainId.OP]: '',
  [ChainId.EVMOS_TESTNET]: CHAINS[ChainId.EVMOS_TESTNET].contracts!.multicall
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

import { ChainId } from '@pangolindex/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: '0xb465Fd2d9C71d5D6e6c069aaC9b4E21c69aAA78f',
  [ChainId.AVALANCHE]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
  [ChainId.WAGMI]: '0x5138349f3027F1e2c2f10eDAD83d38096C0D8Abe',
  [ChainId.COSTON]: '' //attention ici
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

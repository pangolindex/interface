import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'
import PNG_HEDRA from 'src/assets/svg/PNG/PNG_HEDERA.svg'
import PNG_EVMOS from 'src/assets/svg/PNG/PNG_EVMOS.svg'
import { ChainId, Token, ALL_CHAINS, AirdropType } from '@pangolindex/sdk'
import { Tokens } from '@pangolindex/components'

interface AirdropData {
  contractAddress: string
  type: AirdropType
  token: Token
  logo: string
}

export const logoMapping = {
  [ChainId.COSTON]: PNG,
  [ChainId.SONGBIRD]: PSB,
  [ChainId.HEDERA_TESTNET]: PNG_HEDRA,
  [ChainId.HEDERA_MAINNET]: PNG_HEDRA,
  [ChainId.FUJI]: PNG,
  [ChainId.AVALANCHE]: PNG,
  [ChainId.WAGMI]: PNG,
  [ChainId.FLARE_MAINNET]: PNG,
  [ChainId.NEAR_MAINNET]: PNR,
  [ChainId.NEAR_TESTNET]: PNR,
  [ChainId.COSTON2]: PNG,
  [ChainId.EVMOS_TESTNET]: PNG_EVMOS,
  [ChainId.EVMOS_MAINNET]: '',
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
  [ChainId.OP]: ''
}

const { PNG: PNG_TOKEN } = Tokens

export const activeAirdrops: AirdropData[] = ALL_CHAINS.filter(
  chain => chain.mainnet && chain.contracts?.airdrop?.active
).map(chain => ({
  contractAddress: chain!.contracts!.airdrop!.address,
  type: chain!.contracts!.airdrop!.type,
  token: PNG_TOKEN[(chain!.chain_id ?? ChainId.AVALANCHE) as ChainId],
  logo: logoMapping[(chain!.chain_id ?? ChainId.AVALANCHE) as ChainId]
}))

export const specialAirdrops: AirdropData[] = ALL_CHAINS.filter(
  chain => chain.contracts?.specialAirdrops && chain.contracts?.specialAirdrops.length > 0
).reduce((acc, chain) => {
  const airdrops = chain
    .contracts!.specialAirdrops!.filter(airdrop => airdrop.active)
    .map(airdrop => ({
      contractAddress: airdrop!.address,
      type: airdrop!.type,
      token: PNG_TOKEN[(chain!.chain_id ?? ChainId.AVALANCHE) as ChainId],
      logo: logoMapping[(chain!.chain_id ?? ChainId.AVALANCHE) as ChainId],
      title: airdrop!.title
    }))
  const arr = acc.concat(airdrops)
  return arr
}, [] as AirdropData[])

export const comingSoonAirdrops: { token: Token; logo: string }[] = []

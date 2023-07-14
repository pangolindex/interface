import PNG from 'src/assets/svg/PNG/PNG.svg'
import PNR from 'src/assets/svg/PNG/PNR.svg'
import PSB from 'src/assets/svg/PNG/PSB.svg'
import PNG_HEDRA from 'src/assets/svg/PNG/PNG_HEDERA.svg'
import PNG_EVMOS from 'src/assets/svg/PNG/PNG_EVMOS.svg'
import { ChainId, Token, ALL_CHAINS, AirdropType, NetworkType } from '@pangolindex/sdk'
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
  [ChainId.OP]: '',
  [ChainId.SKALE_BELLATRIX_TESTNET]: PNG
}

const { PNG: PNG_TOKEN } = Tokens

export const activeAirdrops: AirdropData[] = ALL_CHAINS.filter(
  chain => chain.mainnet && chain.contracts?.airdrop?.active && chain.network_type === NetworkType.EVM
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

export interface AirdropQuestion {
  title: string
  content: string
}

export const airdropQuestions: AirdropQuestion[] = [
  {
    title: 'What are the eligibility requirements to qualify for the airdrop?',
    content:
      'On Avalanche Network, you must have **held $PNG**, **staked $PNG**, or **created $PNG-$AVAX LP** on Pangolin DEX between **February 2021 and July 31, 2022**'
  },
  {
    title: 'How and where can I claim the airdrop?',
    content:
      'Ensure you are connected with an appropriate wallet with the right network and are in [https://app.pangolin.exchange/#/airdrop/evm-airdrops](https://app.pangolin.exchange/#/airdrop/evm-airdrops)'
  },
  {
    title: 'I am from the United States. Will I receive the airdrop?',
    content:
      'On the advice of our lawyers, we have been made aware that there are applicable laws that may prevent US citizens from claiming the airdrop in a lawful manner.'
  },
  {
    title:
      'If I have my PNG or PNG-AVAX LP on autocompounder platforms like Snowball and Yieldyak, will I receive the airdrop?',
    content:
      'The airdrops will be distributed to wallets on a non-discriminatory basis. As such, wallet owners will receive the airdrop. Ultimately, it will be up to any autocompounders to allocate it to the individual addresses interacting with their platforms. We suggest you ask these teams in their socials. '
  },
  {
    title: 'What is the total allocation being airdropped to users?',
    content: '**2%** of the total supply (**4.6 million**)'
  },
  {
    title: 'Where can I read more?',
    content: '[In our medium article](https://medium.com/pangolin-exchange/litepaper-pangolin-songbird-d092cb117f77)'
  },
  {
    title: 'Is there any bridge from Avalanche to Songbird/Flare?',
    content: 'There are currently no bridges into Songbird/Flare. Stay tuned.'
  },
  {
    title: 'Where can I purchase Songbird (SGB)?',
    content:
      'You can purchase the token on Centralized Exchanges such as Bitfinex, Kraken, Gate.io, MEXC Global, and others. [https://www.coingecko.com/en/coins/songbird#markets](https://www.coingecko.com/en/coins/songbird#markets)'
  },
  {
    title: 'Where can I purchase Flare (FLR)?',
    content:
      'You can purchase the token on Centralized Exchanges such as Bitfinex, Kraken, Gate.io, MEXC Global, and others. [https://www.coingecko.com/en/coins/flare#markets](https://www.coingecko.com/en/coins/flare#markets)'
  },
  {
    title: 'Other helpful resources:',
    content: `[How to swap on Bifrost Wallet](https://www.youtube.com/watch?v=YEqLOK7_Rbw)

[How to Buy, Transfer, and Sell $SGB using a Centralized Exchange (CEX)](https://www.youtube.com/watch?v=XTmzyoKxfdo)

[How to Swap, Provide Liquidity, and Farm on Pangolin DEX (Desktop)](https://www.youtube.com/watch?v=Pbrk6FBFycE)

[$PSB on CoinGecko:](https://www.coingecko.com/en/coins/pangolin-songbird)

[$PFL on CoinGecko:](https://www.coingecko.com/en/coins/pangolin-flare)
`
  }
]

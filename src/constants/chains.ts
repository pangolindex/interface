import Logo from 'src/assets/images/logo.svg'

export interface CHAIN {
  name: string
  symbol: string
  logo: string
}

export enum ChainsId {
  All = 0,
  AVAX = 43114,
  ETH = 1,
  BSC = 56,
  XDAI = 100,
  MATIC = 137,
  FTM = 250,
  OKT = 66,
  HECO = 128,
  OP = 10,
  ARB = 42161,
  CELO = 42220,
  MOVR = 1285,
  CRO = 25,
  BOBA = 288,
  METIS = 1088,
  BTT = 199,
  AURORA = 1313161554,
  MOBM = 1284
}

export const CHAINS = {
  [ChainsId.All]: {
    name: 'All Chains',
    symbol: 'All',
    logo: Logo
  },
  [ChainsId.AVAX]: {
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: 'https://static.debank.com/image/chain/logo_url/avax/4d1649e8a0c7dec9de3491b81807d402.png',
    coingecko_id: 'avalanche'
  },
  [ChainsId.ETH]: {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png',
    coingecko_id: 'ethereum'
  },
  [ChainsId.BSC]: {
    name: 'Binance',
    symbol: 'BSC',
    logo: 'https://static.debank.com/image/chain/logo_url/bsc/7c87af7b52853145f6aa790d893763f1.png',
    coingecko_id: 'binance-smart-chain'
  },
  [ChainsId.XDAI]: {
    name: 'Gnosis',
    symbol: 'XDAI',
    logo: 'https://static.debank.com/image/chain/logo_url/xdai/8b5320523b30bd57a388d1bcc775acd5.png',
    coingecko_id: 'xdai'
  },
  [ChainsId.MATIC]: {
    name: 'Polygon',
    symbol: 'MATIC',
    logo: 'https://static.debank.com/image/chain/logo_url/matic/d3d807aff1a13e9ba51a14ff153d6807.png',
    coingecko_id: 'polygon-pos'
  },
  [ChainsId.FTM]: {
    name: 'Fantom',
    symbol: 'FTM',
    logo: 'https://static.debank.com/image/chain/logo_url/ftm/700fca32e0ee6811686d72b99cc67713.png',
    coingecko_id: 'fantom'
  },
  [ChainsId.OKT]: {
    name: 'OEC',
    symbol: 'OKT',
    logo: 'https://static.debank.com/image/chain/logo_url/okt/1228cd92320b3d33769bd08eecfb5391.png',
    coingecko_id: 'okex-chain'
  },
  [ChainsId.HECO]: {
    name: 'Heco',
    symbol: 'HECO',
    logo: 'https://static.debank.com/image/chain/logo_url/heco/db5152613c669e0cc8624d466d6c94ea.png',
    coingecko_id: 'huobi-token'
  },
  [ChainsId.OP]: {
    name: 'Optimism',
    symbol: 'OP',
    logo: 'https://static.debank.com/image/chain/logo_url/op/01ae734fe781c9c2ae6a4cc7e9244056.png',
    coingecko_id: 'optimistic-ethereum'
  },
  [ChainsId.ARB]: {
    name: 'Arbitrum',
    symbol: 'ARB',
    logo: 'https://static.debank.com/image/chain/logo_url/arb/f6d1b236259654d531a1459b2bccaf64.png',
    coingecko_id: 'arbitrum-one'
  },
  [ChainsId.CELO]: {
    name: 'Celo',
    symbol: 'CELO',
    logo: 'https://static.debank.com/image/chain/logo_url/celo/41da5c1d3c0945ae822a1f85f02c76cf.png',
    coingecko_id: 'celo'
  },
  [ChainsId.MOVR]: {
    name: 'Moonriver',
    symbol: 'MOVR',
    logo: 'https://static.debank.com/image/chain/logo_url/movr/4b0de5a711b437f187c0d0f15cc0398b.png',
    coingecko_id: 'moonriver'
  },
  [ChainsId.CRO]: {
    name: 'Cronos',
    symbol: 'CRO',
    logo: 'https://static.debank.com/image/chain/logo_url/cro/44f784a1f4c0ea7d26d00acabfdf0028.png',
    coingecko_id: 'cronos'
  },
  [ChainsId.BOBA]: {
    name: 'Boba',
    symbol: 'BOBA',
    logo: 'https://static.debank.com/image/chain/logo_url/boba/e43d79cd8088ceb3ea3e4a240a75728f.png',
    coingecko_id: 'boba'
  },
  [ChainsId.METIS]: {
    name: 'Metis',
    symbol: 'METIS',
    logo: 'https://static.debank.com/image/chain/logo_url/metis/b289da32db4d860ebf6fb46a6e41dcfc.png',
    coingecko_id: 'metis-andromeda'
  },
  [ChainsId.BTT]: {
    name: 'BitTorrent',
    symbol: 'BTT',
    logo: 'https://static.debank.com/image/chain/logo_url/btt/2130a8d57ff2a0f3d50a4ec9432897c6.png',
    coingecko_id: ''
  },
  [ChainsId.AURORA]: {
    name: 'Aurora',
    symbol: 'AURORA',
    logo: 'https://static.debank.com/image/chain/logo_url/aurora/c7590fd2defb8e7d7dc071166838c33a.png',
    coingecko_id: 'aurora'
  },
  [ChainsId.MOBM]: {
    name: 'Moonbeam',
    symbol: 'MOBM',
    logo: 'https://static.debank.com/image/chain/logo_url/mobm/a8442077d76b258297181c3e6eb8c9cc.png',
    coingecko_id: 'moonbeam'
  }
}

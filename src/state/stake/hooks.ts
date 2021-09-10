import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair } from '@pangolindex/sdk'
import { useMemo } from 'react'
import {
  PNG,
  DAI,
  DAIe,
  UNI,
  UNIe,
  SUSHI,
  SUSHIe,
  ETH,
  WETHe,
  USDT,
  USDTe,
  WBTC,
  WBTCe,
  LINK,
  LINKe,
  AAVE,
  AAVEe,
  YFI,
  YFIe,
  SNOB,
  VSO,
  SPORE,
  BIFI,
  BNB,
  XAVA,
  PEFI,
  TRYB,
  SHERPA,
  YAK,
  DYP,
  QI,
  WALBT,
  HUSKY,
  USDCe,
  LYD,
  TUSD,
  GAJ,
  GDL,
  MFI,
  SHIBX,
  AVE,
  ELE,
  FRAX,
  FXS,
  START,
  SWAPe,
  YTS,
  TUNDRA,
  XUSD,
  XDO,
  JOE,
  ZABU,
  YAY
} from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useTranslation } from 'react-i18next'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import useUSDCPrice from '../../utils/useUSDCPrice'

export interface SingleSideStaking {
  rewardToken: Token
  stakingRewardAddress: string
  version: number
}

export interface DoubleSideStaking {
  tokens: [Token, Token]
  stakingRewardAddress: string
  version: number
  multiplier: number
}

export interface Migration {
  from: DoubleSideStaking
  to: DoubleSideStaking
}

export interface BridgeMigrator {
  aeb: string
  ab: string
}

const SINGLE_SIDE_STAKING: { [key: string]: SingleSideStaking } = {
  PNG_V0: {
    rewardToken: WAVAX[ChainId.AVALANCHE],
    stakingRewardAddress: '0xD49B406A7A29D64e081164F6C3353C599A2EeAE9',
    version: 0
  }
}

const DOUBLE_SIDE_STAKING: { [key: string]: DoubleSideStaking } = {
  WAVAX_ETH_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xa16381eae6285123c323A665D4D99a6bCfaAC307',
    version: 0,
    multiplier: 0
  },
  WAVAX_USDT_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4f019452f51bbA0250Ec8B69D64282B79fC8BD9f',
    version: 0,
    multiplier: 0
  },
  WAVAX_WBTC_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x01897e996EEfFf65AE9999C02D1d8D7E9e0C0352',
    version: 0,
    multiplier: 0
  },
  WAVAX_PNG_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x8FD2755c6ae7252753361991bDcd6fF55bDc01CE',
    version: 0,
    multiplier: 0
  },
  WAVAX_LINK_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7d7eCd4d370384B17DFC1b4155a8410e97841B65',
    version: 0,
    multiplier: 0
  },
  WAVAX_DAI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb5b9DEd9C193731f816AE1f8FfB7f8B0FaE40c88',
    version: 0,
    multiplier: 0
  },
  WAVAX_UNI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe4d9aE03859DaC6d65432d557F75b9b588a38eE1',
    version: 0,
    multiplier: 0
  },
  WAVAX_SUSHI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x88f26b81c9cae4ea168e31BC6353f493fdA29661',
    version: 0,
    multiplier: 0
  },
  WAVAX_AAVE_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xEe0023108918884181E48902f7C797573F413EcE',
    version: 0,
    multiplier: 0
  },
  WAVAX_YFI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x797CBcf107519f4b279Fc5Db372e292cdF7e6956',
    version: 0,
    multiplier: 0
  },
  PNG_ETH_V0: {
    tokens: [PNG[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4e550fEfBf888cB43eaD73d821f646F43b1F2309',
    version: 0,
    multiplier: 0
  },
  PNG_USDT_V0: {
    tokens: [PNG[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7accC6f16Bf8c0Dce22371fbD914c6B5b402BF9f',
    version: 0,
    multiplier: 0
  },
  PNG_WBTC_V0: {
    tokens: [PNG[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x99B06B9673fea30Ba55179b1433ce909Fdc28723',
    version: 0,
    multiplier: 0
  },
  PNG_LINK_V0: {
    tokens: [PNG[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4Ad6e309805cb477010beA9fFC650cB27C1A9504',
    version: 0,
    multiplier: 0
  },
  PNG_DAI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x8866077F08b076360C25F4Fd7fbC959ef135474C',
    version: 0,
    multiplier: 0
  },
  PNG_UNI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x41188B4332fe68135d1524E43db98e81519d263B',
    version: 0,
    multiplier: 0
  },
  PNG_SUSHI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6955Cb85edEa63F861c0Be39C3d7F8921606c4Dc',
    version: 0,
    multiplier: 0
  },
  PNG_AAVE_V0: {
    tokens: [PNG[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb921a3aE9CeDa66fa8A74DBb0946367FB14faE34',
    version: 0,
    multiplier: 0
  },
  PNG_YFI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2061298C76cD76219b9b44439e96A75F19C61f7f',
    version: 0,
    multiplier: 0
  },
  WAVAX_ETH_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x417C02150b9a31BcaCb201d1D60967653384E1C6',
    version: 1,
    multiplier: 0
  },
  WAVAX_WETHe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], WETHe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x830A966B9B447c9B15aB24c0369c4018E75F31C9',
    version: 1,
    multiplier: 10
  },
  WAVAX_USDT_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x94C021845EfE237163831DAC39448cFD371279d6',
    version: 1,
    multiplier: 0
  },
  WAVAX_USDTe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDTe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x006cC053bdb84C2d6380B3C4a573d84636378A47',
    version: 1,
    multiplier: 10
  },
  WAVAX_WBTC_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe968E9753fd2c323C2Fe94caFF954a48aFc18546',
    version: 1,
    multiplier: 0
  },
  WAVAX_WBTCe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], WBTCe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x30CbF11f6fcc9FC1bF6E55A6941b1A47A56eAEC5',
    version: 1,
    multiplier: 1
  },
  WAVAX_PNG_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x574d3245e36Cf8C9dc86430EaDb0fDB2F385F829',
    version: 1,
    multiplier: 12
  },
  WAVAX_LINK_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xBDa623cDD04d822616A263BF4EdbBCe0B7DC4AE7',
    version: 1,
    multiplier: 0
  },
  WAVAX_LINKe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], LINKe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2e10D9d08f76807eFdB6903025DE8e006b1185F5',
    version: 1,
    multiplier: 1
  },
  WAVAX_DAI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x701e03fAD691799a8905043C0d18d2213BbCf2c7',
    version: 1,
    multiplier: 0
  },
  WAVAX_DAIe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], DAIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x63A84F66b8c90841Cb930F2dC3D28799F0c6657B',
    version: 1,
    multiplier: 10
  },
  WAVAX_UNI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x1F6aCc5F5fE6Af91C1BB3bEbd27f4807a243D935',
    version: 1,
    multiplier: 0
  },
  WAVAX_UNIe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], UNIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6E36A71c1A211f01Ff848C1319D4e34BB5483224',
    version: 1,
    multiplier: 1
  },
  WAVAX_SUSHI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xDA354352b03f87F84315eEF20cdD83c49f7E812e',
    version: 1,
    multiplier: 0
  },
  WAVAX_SUSHIe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SUSHIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2D55341f2abbb5472020e2d556a4f6B951C8Fa22',
    version: 1,
    multiplier: 1
  },
  WAVAX_AAVE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4dF32F1F8469648e89E62789F4246f73fe768b8E',
    version: 1,
    multiplier: 0
  },
  WAVAX_AAVEe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], AAVEe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xa04fCcE7955312709c838982ad0E297375002C32',
    version: 1,
    multiplier: 1
  },
  WAVAX_YFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2C31822F35506C6444F458Ed7470c79f9924Ee86',
    version: 1,
    multiplier: 0
  },
  WAVAX_YFIe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YFIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x642c5B7AC22f56A0eF87930a89f0980FcA904B03',
    version: 1,
    multiplier: 1
  },
  WAVAX_SNOB_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SNOB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x640D754113A3CBDd80BcCc1b5c0387148EEbf2fE',
    version: 1,
    multiplier: 1
  },
  WAVAX_VSO_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], VSO[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xf2b788085592380bfCAc40Ac5E0d10D9d0b54eEe',
    version: 1,
    multiplier: 1
  },
  WAVAX_SPORE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SPORE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xd3e5538A049FcFcb8dF559B85B352302fEfB8d7C',
    version: 1,
    multiplier: 1
  },
  WAVAX_BIFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], BIFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4E258f7ec60234bb6f3Ea7eCFf5931901182Bd6E',
    version: 1,
    multiplier: 1
  },
  WAVAX_BNB_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], BNB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x21CCa1672E95996413046077B8cf1E52F080A165',
    version: 1,
    multiplier: 1
  },
  WAVAX_XAVA_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], XAVA[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4219330Af5368378D5ffd869a55f5F2a26aB898c',
    version: 1,
    multiplier: 1
  },
  WAVAX_PEFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], PEFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xd7EDBb1005ec65721a3976Dba996AdC6e02dc9bA',
    version: 1,
    multiplier: 1
  },
  WAVAX_TRYB_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], TRYB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x079a479e270E72A1899239570912358C6BC22d94',
    version: 1,
    multiplier: 1
  },
  WAVAX_SHERPA_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SHERPA[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x99918c92655D6f8537588210cD3Ddd52312CB36d',
    version: 1,
    multiplier: 1
  },
  WAVAX_YAK_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YAK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb600429CCD364F1727F91FC0E75D67d65D0ee4c5',
    version: 1,
    multiplier: 1
  },
  WAVAX_DYP_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], DYP[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x29a7F3D1F27637EDA531dC69D989c86Ab95225D8',
    version: 1,
    multiplier: 1
  },
  WAVAX_QI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], QI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xeD472431e02Ea9EF8cC99B9812c335ac0873bba2',
    version: 1,
    multiplier: 1
  },
  WAVAX_WALBT_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], WALBT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xa296F9474e77aE21f90afb50713F44Cc6916FbB2',
    version: 1,
    multiplier: 1
  },
  WAVAX_HUSKY_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], HUSKY[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2e60ab79BbCdfea164874700D5d98969a386eB2a',
    version: 1,
    multiplier: 1
  },
  WAVAX_USDCe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDCe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x84B536dA1A2D9b0609f9Da73139674cc2D75AF2D',
    version: 1,
    multiplier: 10
  },
  WAVAX_LYD_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], LYD[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xE6dE666a80a357497A2cAB3A91F1c28dcAA1Eca4',
    version: 1,
    multiplier: 1
  },
  WAVAX_TUSD_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], TUSD[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xf2dd964AcF53ad8959540CceEFD9FeA13d4D0Eb1',
    version: 1,
    multiplier: 1
  },
  WAVAX_GAJ_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], GAJ[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xd31FFD05a41645631A22a64c1f870a6248A4DDcF',
    version: 1,
    multiplier: 1
  },
  WAVAX_GDL_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], GDL[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xA6F2408e3CD34084c37A0D88FED8C6b6490F7529',
    version: 1,
    multiplier: 2
  },
  WAVAX_MFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], MFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xd64370aeDbEbbAE04CfCaE27E8E0c5ecbD343336',
    version: 1,
    multiplier: 1
  },
  WAVAX_SHIBX_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SHIBX[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x0029381eFF48E9eA963F8095eA204098ac8e44B5',
    version: 1,
    multiplier: 2
  },
  WAVAX_AVE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], AVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x94183DD08FFAa595e43B104804d55eE95492C8cB',
    version: 1,
    multiplier: 1
  },
  WAVAX_ELE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], ELE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x10E5d5f598abb970F85456Ea59f0611D77E00168',
    version: 1,
    multiplier: 1
  },
  WAVAX_FRAX_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], FRAX[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xfd0824dF1E598D34C3495e1C2a339E2FA23Af40D',
    version: 1,
    multiplier: 2
  },
  WAVAX_FXS_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], FXS[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x76Ad5c64Fe6B26b6aD9aaAA19eBa00e9eCa31FE1',
    version: 1,
    multiplier: 1
  },
  WAVAX_START_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], START[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x5105d9De003fB7d22979cd0cE167Ab919E60900A',
    version: 1,
    multiplier: 2
  },
  WAVAX_SWAPe_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SWAPe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x255e7a0eB5aa1616781702203B042821C35394eF',
    version: 1,
    multiplier: 2
  },
  WAVAX_YTS_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YTS[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6F571bA11447136fC11BA9AC98f0f0233dAc1BFF',
    version: 1,
    multiplier: 2
  },
  WAVAX_TUNDRA_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], TUNDRA[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xeD617a06C6c727827Ca3B6fb3E565C68342c4c2b',
    version: 1,
    multiplier: 2
  },
  WAVAX_XUSD_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], XUSD[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xbD56b964FCdd208a7a83C291864eEb8271BaB773',
    version: 1,
    multiplier: 2
  },
  WAVAX_XDO_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], XDO[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x5d479aEbfc49b9e08860BbfCfb3BB4D768Aa1fc3',
    version: 1,
    multiplier: 2
  },
  WAVAX_JOE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], JOE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xC0B2D45b8617997bcDad0F33AEE03e4DF4C4f81E',
    version: 1,
    multiplier: 2
  },
  WAVAX_ZABU_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], ZABU[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x184949E5A7E8740Da20231B90Fd38E7725FA657A',
    version: 1,
    multiplier: 2
  },
  WAVAX_YAY_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YAY[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2DaE4d6Cccd824917cA783774C1e8854FF86951F',
    version: 1,
    multiplier: 2
  },

  PNG_ETH_V1: {
    tokens: [PNG[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7ac007afB5d61F48D1E3C8Cc130d4cf6b765000e',
    version: 1,
    multiplier: 0
  },
  PNG_WETHe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], WETHe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x03a9091620CACeE4968c915232B175C16a584733',
    version: 1,
    multiplier: 3
  },
  PNG_USDT_V1: {
    tokens: [PNG[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xE2510a1fCCCde8d2D1c40b41e8f71fB1F47E5bBA',
    version: 1,
    multiplier: 0
  },
  PNG_USDTe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], USDTe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7216d1e173c1f1Ed990239d5c77d74714a837Cd5',
    version: 1,
    multiplier: 5
  },
  PNG_WBTC_V1: {
    tokens: [PNG[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x681047473B6145BA5dB90b074E32861549e85cC7',
    version: 1,
    multiplier: 1
  },
  PNG_WBTCe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], WBTCe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xEeEA1e815f12d344b5035a33da4bc383365F5Fee',
    version: 1,
    multiplier: 3
  },
  PNG_LINK_V1: {
    tokens: [PNG[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6356b24b36074AbE2903f44fE4019bc5864FDe36',
    version: 1,
    multiplier: 3
  },
  PNG_LINKe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], LINKe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4B283e4211B3fAa525846d21869925e78f93f189',
    version: 1,
    multiplier: 3
  },
  PNG_DAI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe3103e565cF96a5709aE8e603B1EfB7fED04613B',
    version: 1,
    multiplier: 0
  },
  PNG_DAIe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], DAIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xF344611DD94099708e508C2Deb16628578940d77',
    version: 1,
    multiplier: 1
  },
  PNG_UNI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4f74BbF6859A994e7c309eA0f11E3Cc112955110',
    version: 1,
    multiplier: 0
  },
  PNG_UNIe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], UNIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xD4E49A8Ec23daB51ACa459D233e9447DE03AFd29',
    version: 1,
    multiplier: 3
  },
  PNG_SUSHI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x633F4b4DB7dD4fa066Bd9949Ab627a551E0ecd32',
    version: 1,
    multiplier: 0
  },
  PNG_SUSHIe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SUSHIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x923E69322Bea5e22799a29Dcfc9c616F3B5cF95b',
    version: 1,
    multiplier: 3
  },
  PNG_AAVE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xFd9ACEc0F413cA05d5AD5b962F3B4De40018AD87',
    version: 1,
    multiplier: 0
  },
  PNG_AAVEe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], AAVEe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x3F91756D773A1455A7a1A70f5d9239F1B1d1f095',
    version: 1,
    multiplier: 3
  },
  PNG_YFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xc7D0E29b616B29aC6fF4FD5f37c8Da826D16DB0D',
    version: 1,
    multiplier: 0
  },
  PNG_YFIe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], YFIe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x269Ed6B2040f965D9600D0859F36951cB9F01460',
    version: 1,
    multiplier: 3
  },
  PNG_SNOB_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SNOB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x08B9A023e34Bad6Db868B699fa642Bf5f12Ebe76',
    version: 1,
    multiplier: 5
  },
  PNG_VSO_V1: {
    tokens: [PNG[ChainId.AVALANCHE], VSO[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x759ee0072901f409e4959E00b00a16FD729397eC',
    version: 1,
    multiplier: 5
  },
  PNG_SPORE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SPORE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x12A33F6B0dd0D35279D402aB61587fE7eB23f7b0',
    version: 1,
    multiplier: 5
  },
  PNG_BIFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], BIFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x518B07E2d9e08A8c2e3cB7704336520827a4d399',
    version: 1,
    multiplier: 5
  },
  PNG_BNB_V1: {
    tokens: [PNG[ChainId.AVALANCHE], BNB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x68a90C38bF4f90AC2a870d6FcA5b0A5A218763AD',
    version: 1,
    multiplier: 5
  },
  PNG_XAVA_V1: {
    tokens: [PNG[ChainId.AVALANCHE], XAVA[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x5b3Ed7f47D1d4FA22b559D043a09d78bc55A94E9',
    version: 1,
    multiplier: 5
  },
  PNG_PEFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], PEFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x76e404Ab7357fD97d4f1e8Dd52f298A035fd408c',
    version: 1,
    multiplier: 5
  },
  PNG_TRYB_V1: {
    tokens: [PNG[ChainId.AVALANCHE], TRYB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x0A9773AEbc1429d860A492d70c8EA335fAa9F19f',
    version: 1,
    multiplier: 5
  },
  PNG_SHERPA_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SHERPA[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x80E919784e7c5AD3Dd59cAfCDC0e9C079B65f262',
    version: 1,
    multiplier: 5
  },
  PNG_YAK_V1: {
    tokens: [PNG[ChainId.AVALANCHE], YAK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x42ff9473a5AEa00dE39355e0288c7A151EB00B6e',
    version: 1,
    multiplier: 5
  },
  PNG_DYP_V1: {
    tokens: [PNG[ChainId.AVALANCHE], DYP[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x3A0eF6a586D9C15de30eDF5d34ae00E26b0125cE',
    version: 1,
    multiplier: 5
  },
  PNG_QI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], QI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2bD42C357a3e13F18849C67e8dC108Cc8462ae33',
    version: 1,
    multiplier: 5
  },
  PNG_WALBT_V1: {
    tokens: [PNG[ChainId.AVALANCHE], WALBT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x393fe4bc29AfbB3786D99f043933c49097449fA1',
    version: 1,
    multiplier: 5
  },
  PNG_HUSKY_V1: {
    tokens: [PNG[ChainId.AVALANCHE], HUSKY[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x07b34dAABcb75C9cbD0c8AEfbC0ed5E30845eF12',
    version: 1,
    multiplier: 5
  },
  PNG_USDCe_V1: {
    tokens: [PNG[ChainId.AVALANCHE], USDCe[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x73d1cC4B8dA555005E949B3ECEE490A7206C14DF',
    version: 1,
    multiplier: 5
  },
  PNG_LYD_V1: {
    tokens: [PNG[ChainId.AVALANCHE], LYD[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe1314E6d436877850BB955Ac074226FCB0B8a86d',
    version: 1,
    multiplier: 5
  },
  PNG_TUSD_V1: {
    tokens: [PNG[ChainId.AVALANCHE], TUSD[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6fa49bd916e392dc9264636b0b5Cf2beee652dA3',
    version: 1,
    multiplier: 5
  },
  PNG_GAJ_V1: {
    tokens: [PNG[ChainId.AVALANCHE], GAJ[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x95bD8FDb58692d343C89bC7bc435773779CC0e47',
    version: 1,
    multiplier: 5
  },
  PNG_GDL_V1: {
    tokens: [PNG[ChainId.AVALANCHE], GDL[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb008e7AD32c710B07fb8D4453aBC79214Cd34891',
    version: 1,
    multiplier: 0
  },
  PNG_MFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], MFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4c0650668A63EF468c7bDCd910A62287e9FC4d52',
    version: 1,
    multiplier: 5
  },
  PNG_SHIBX_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SHIBX[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xEcF9b9aE88150F11cbf2263c69823e2ECb84F07B',
    version: 1,
    multiplier: 0
  },
  PNG_AVE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], AVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7C960e55C8119457528490C3a34C1438FaF6B039',
    version: 1,
    multiplier: 5
  },
  PNG_ELE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], ELE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xfcB0C53FC5c71005D11C6838922e254323b7Ca06',
    version: 1,
    multiplier: 5
  }
}

// The first mapping in the list takes priority if multiple migrations exist from the same pool
export const MIGRATIONS: Migration[] = [
  { from: DOUBLE_SIDE_STAKING.WAVAX_PNG_V0, to: DOUBLE_SIDE_STAKING.WAVAX_PNG_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_ETH_V0, to: DOUBLE_SIDE_STAKING.WAVAX_WETHe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_USDT_V0, to: DOUBLE_SIDE_STAKING.WAVAX_USDTe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_WBTC_V0, to: DOUBLE_SIDE_STAKING.WAVAX_WBTCe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_LINK_V0, to: DOUBLE_SIDE_STAKING.WAVAX_LINKe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_DAI_V0, to: DOUBLE_SIDE_STAKING.WAVAX_DAIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_UNI_V0, to: DOUBLE_SIDE_STAKING.WAVAX_UNIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_SUSHI_V0, to: DOUBLE_SIDE_STAKING.WAVAX_SUSHIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_AAVE_V0, to: DOUBLE_SIDE_STAKING.WAVAX_AAVEe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_YFI_V0, to: DOUBLE_SIDE_STAKING.WAVAX_YFIe_V1 },
  // From v0 (PNG)
  { from: DOUBLE_SIDE_STAKING.PNG_ETH_V0, to: DOUBLE_SIDE_STAKING.PNG_WETHe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_USDT_V0, to: DOUBLE_SIDE_STAKING.PNG_USDTe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_WBTC_V0, to: DOUBLE_SIDE_STAKING.PNG_WBTCe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_LINK_V0, to: DOUBLE_SIDE_STAKING.PNG_LINKe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_DAI_V0, to: DOUBLE_SIDE_STAKING.PNG_DAIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_UNI_V0, to: DOUBLE_SIDE_STAKING.PNG_UNIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_SUSHI_V0, to: DOUBLE_SIDE_STAKING.PNG_SUSHIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_AAVE_V0, to: DOUBLE_SIDE_STAKING.PNG_AAVEe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_YFI_V0, to: DOUBLE_SIDE_STAKING.PNG_YFIe_V1 },

  // From v1 (WAVAX)
  { from: DOUBLE_SIDE_STAKING.WAVAX_ETH_V1, to: DOUBLE_SIDE_STAKING.WAVAX_WETHe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_USDT_V1, to: DOUBLE_SIDE_STAKING.WAVAX_USDTe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_WBTC_V1, to: DOUBLE_SIDE_STAKING.WAVAX_WBTCe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_LINK_V1, to: DOUBLE_SIDE_STAKING.WAVAX_LINKe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_DAI_V1, to: DOUBLE_SIDE_STAKING.WAVAX_DAIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_UNI_V1, to: DOUBLE_SIDE_STAKING.WAVAX_UNIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_SUSHI_V1, to: DOUBLE_SIDE_STAKING.WAVAX_SUSHIe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_AAVE_V1, to: DOUBLE_SIDE_STAKING.WAVAX_AAVEe_V1 },
  { from: DOUBLE_SIDE_STAKING.WAVAX_YFI_V1, to: DOUBLE_SIDE_STAKING.WAVAX_YFIe_V1 },
  // From v1 (PNG)
  { from: DOUBLE_SIDE_STAKING.PNG_ETH_V1, to: DOUBLE_SIDE_STAKING.PNG_WETHe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_USDT_V1, to: DOUBLE_SIDE_STAKING.PNG_USDTe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_WBTC_V1, to: DOUBLE_SIDE_STAKING.PNG_WBTCe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_LINK_V1, to: DOUBLE_SIDE_STAKING.PNG_LINKe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_DAI_V1, to: DOUBLE_SIDE_STAKING.PNG_DAIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_UNI_V1, to: DOUBLE_SIDE_STAKING.PNG_UNIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_SUSHI_V1, to: DOUBLE_SIDE_STAKING.PNG_SUSHIe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_AAVE_V1, to: DOUBLE_SIDE_STAKING.PNG_AAVEe_V1 },
  { from: DOUBLE_SIDE_STAKING.PNG_YFI_V1, to: DOUBLE_SIDE_STAKING.PNG_YFIe_V1 }
]

export const BRIDGE_MIGRATORS: BridgeMigrator[] = [
  { aeb: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', ab: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB' }, // ETH
  { aeb: '0xde3A24028580884448a5397872046a019649b084', ab: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118' }, // USDT
  { aeb: '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB', ab: '0x50b7545627a5162F82A992c33b87aDc75187B218' }, // WBTC
  { aeb: '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651', ab: '0x5947BB275c521040051D82396192181b413227A3' }, // LINK
  { aeb: '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', ab: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70' }, // DAI
  { aeb: '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab', ab: '0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580' }, // UNI
  { aeb: '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc', ab: '0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76' }, // SUSHI
  { aeb: '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9', ab: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9' }, // AAVE
  { aeb: '0x99519AcB025a0e0d44c3875A4BbF03af65933627', ab: '0x9eAaC1B23d935365bD7b542Fe22cEEe2922f52dc' } // YFI
]

export const SINGLE_SIDE_STAKING_V0: SingleSideStaking[] = Object.values(SINGLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const SINGLE_SIDE_STAKING_REWARDS_CURRENT_VERSION = Math.max(
  ...Object.values(SINGLE_SIDE_STAKING).map(staking => staking.version)
)

export const DOUBLE_SIDE_STAKING_V0: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const DOUBLE_SIDE_STAKING_V1: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 1
)
export const DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION = Math.max(
  ...Object.values(DOUBLE_SIDE_STAKING).map(staking => staking.version)
)

export const SINGLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: SingleSideStaking[][]
} = {
  [ChainId.AVALANCHE]: [SINGLE_SIDE_STAKING_V0]
}

export const DOUBLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: DoubleSideStaking[][]
} = {
  [ChainId.AVALANCHE]: [DOUBLE_SIDE_STAKING_V0, DOUBLE_SIDE_STAKING_V1]
}

export interface StakingInfoBase {
  // the address of the reward contract
  stakingRewardAddress: string
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // has the reward period expired
  isPeriodFinished: boolean
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

export interface SingleSideStakingInfo extends StakingInfoBase {
  // the token being earned
  rewardToken: Token
  // total staked PNG in the pool
  totalStakedInPng: TokenAmount
  apr: JSBI
}

export interface DoubleSideStakingInfo extends StakingInfoBase {
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the pool weight
  multiplier: JSBI
  // total staked AVAX in the pool
  totalStakedInWavax: TokenAmount
  totalStackedInUsd: TokenAmount
}

const calculateTotalStakedAmountInAvaxFromPng = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  avaxPngPairReserveOfPng: JSBI,
  avaxPngPairReserveOfWavax: JSBI,
  reserveInPng: JSBI
): TokenAmount {
  if (JSBI.EQ(amountAvailable, JSBI.BigInt(0))) {
    return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.BigInt(0))
  }

  const oneToken = JSBI.BigInt(1000000000000000000)
  const avaxPngRatio = JSBI.divide(JSBI.multiply(oneToken, avaxPngPairReserveOfWavax), avaxPngPairReserveOfPng)
  const valueOfPngInAvax = JSBI.divide(JSBI.multiply(reserveInPng, avaxPngRatio), oneToken)

  return new TokenAmount(
    WAVAX[ChainId.AVALANCHE],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(amountStaked, valueOfPngInAvax),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      amountAvailable
    )
  )
}

const calculateRewardRateInPng = function(
  rewardRate: JSBI,
  pair: Pair | null,
  stakingToken: Token,
  rewardToken: Token
): JSBI {
  if (!pair) return JSBI.BigInt(0)

  // TODO: Handle situation where stakingToken and rewardToken have different decimals
  const oneToken = JSBI.BigInt(1000000000000000000)

  const pairRatio = JSBI.divide(
    JSBI.multiply(oneToken, pair.reserveOf(stakingToken).raw), // Multiply first for precision
    pair.reserveOf(rewardToken).raw
  )
  return JSBI.divide(
    JSBI.multiply(rewardRate, pairRatio), // Multiply first for precision
    oneToken
  )
}

const calculateApr = function(rewardRatePerSecond: JSBI, totalSupply: JSBI): JSBI {
  if (JSBI.EQ(totalSupply, JSBI.BigInt(0))) {
    return JSBI.BigInt(0)
  }

  const rewardsPerYear = JSBI.multiply(
    rewardRatePerSecond,
    JSBI.BigInt(31536000) // Seconds in year
  )

  return JSBI.divide(JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)), totalSupply)
}

const calculateTotalStakedAmountInAvax = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  reserveInWavax: JSBI
): TokenAmount {
  if (JSBI.GT(amountAvailable, 0)) {
    // take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
    return new TokenAmount(
      WAVAX[ChainId.AVALANCHE],
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(amountStaked, reserveInWavax),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
        ),
        amountAvailable
      )
    )
  } else {
    return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.BigInt(0))
  }
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(version: number, pairToFilterBy?: Pair | null): DoubleSideStakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(stakingRewardInfo =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy, version]
  )

  const png = PNG[ChainId.AVALANCHE]

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const stakingTotalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')
  const pairs = usePairs(tokens)

  const pairAddresses = useMemo(() => {
    const pairsHaveLoaded = pairs?.every(([state, pair]) => state === PairState.EXISTS)
    if (!pairsHaveLoaded) return []
    else return pairs.map(([state, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')

  const [avaxPngPairState, avaxPngPair] = usePair(WAVAX[ChainId.AVALANCHE], png)

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  const wavax = WAVAX[ChainId.AVALANCHE]

  const usDPrice = useUSDCPrice(wavax)

  return useMemo(() => {
    if (!chainId || !png) return []

    return rewardsAddresses.reduce<DoubleSideStakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const stakingTotalSupplyState = stakingTotalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]
      const [pairState, pair] = pairs[index]
      const pairTotalSupplyState = pairTotalSupplies[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        stakingTotalSupplyState?.loading === false &&
        rewardRateState?.loading === false &&
        periodFinishState?.loading === false &&
        pairTotalSupplyState?.loading === false &&
        pair &&
        avaxPngPair &&
        pairState !== PairState.LOADING &&
        avaxPngPairState !== PairState.LOADING
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          stakingTotalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
          pairTotalSupplyState.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS ||
          avaxPngPairState === PairState.INVALID ||
          avaxPngPairState === PairState.NOT_EXISTS
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const wavax = tokens[0].equals(WAVAX[tokens[0].chainId]) ? tokens[0] : tokens[1]
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
        // check for account, if no account set to 0

        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        // periodFinish will be 0 immediately after a reward contract is initialized
        const isPeriodFinished = periodFinishMs === 0 ? false : periodFinishMs < Date.now()

        const totalSupplyStaked = JSBI.BigInt(stakingTotalSupplyState.result?.[0])
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyStaked))
        const totalRewardRate = new TokenAmount(png, JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0]))

        const isAvaxPool = tokens[0].equals(WAVAX[tokens[0].chainId])
        const totalStakedInWavax = isAvaxPool
          ? calculateTotalStakedAmountInAvax(totalSupplyStaked, totalSupplyAvailable, pair.reserveOf(wavax).raw)
          : calculateTotalStakedAmountInAvaxFromPng(
              totalSupplyStaked,
              totalSupplyAvailable,
              avaxPngPair.reserveOf(png).raw,
              avaxPngPair.reserveOf(WAVAX[tokens[1].chainId]).raw,
              pair.reserveOf(png).raw
            )

        const totalStackedInUsd = totalStakedInWavax && (usDPrice?.quote(totalStakedInWavax) as TokenAmount)
        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            png,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const multiplier = info[index].multiplier

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished: isPeriodFinished,
          earnedAmount: new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInWavax: totalStakedInWavax,
          totalStackedInUsd: totalStackedInUsd,
          multiplier: JSBI.BigInt(multiplier),
          getHypotheticalRewardRate
        })
      }
      return memo
    }, [])
  }, [
    chainId,
    png,
    rewardsAddresses,
    balances,
    earnedAmounts,
    stakingTotalSupplies,
    rewardRates,
    periodFinishes,
    pairs,
    pairTotalSupplies,
    avaxPngPair,
    avaxPngPairState,
    info
  ])
}

export function useSingleSideStakingInfo(
  version: number,
  rewardTokenToFilterBy?: Token | null
): SingleSideStakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? SINGLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(stakingRewardInfo =>
            rewardTokenToFilterBy === undefined
              ? true
              : rewardTokenToFilterBy === null
              ? false
              : rewardTokenToFilterBy.equals(stakingRewardInfo.rewardToken)
          ) ?? []
        : [],
    [chainId, rewardTokenToFilterBy, version]
  )

  const png = PNG[ChainId.AVALANCHE]

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const tokens = useMemo((): [Token, Token][] => info.map(({ rewardToken }) => [png, rewardToken]), [info])
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const pairs = usePairs(tokens)

  const pairsHaveLoaded = useMemo(() => {
    return pairs?.every(([state, pair]) => state !== PairState.LOADING)
  }, [pairs])

  const stakingTotalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !png) return []

    return rewardsAddresses.reduce<SingleSideStakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const stakingTotalSupplyState = stakingTotalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        pairsHaveLoaded === true &&
        stakingTotalSupplyState?.loading === false &&
        rewardRateState?.loading === false &&
        periodFinishState?.loading === false
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          stakingTotalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        const rewardToken = info[index].rewardToken
        const [, pngPair] = pairs[index]
        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        // periodFinish will be 0 immediately after a reward contract is initialized
        const isPeriodFinished = periodFinishMs === 0 ? false : periodFinishMs < Date.now()

        const totalSupplyStaked = JSBI.BigInt(stakingTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(png, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(png, JSBI.BigInt(totalSupplyStaked))
        const totalRewardRate = new TokenAmount(
          rewardToken,
          JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0])
        )
        const earnedAmount = new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0))

        const rewardRateInPng = calculateRewardRateInPng(totalRewardRate.raw, pngPair, png, rewardToken)

        const apr = isPeriodFinished ? JSBI.BigInt(0) : calculateApr(rewardRateInPng, totalSupplyStaked)

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            rewardToken,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        memo.push({
          stakingRewardAddress: rewardsAddress,
          rewardToken: rewardToken,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished: isPeriodFinished,
          earnedAmount: earnedAmount,
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInPng: totalStakedAmount,
          getHypotheticalRewardRate,
          apr: apr
        })
      }
      return memo
    }, [])
  }, [
    chainId,
    png,
    rewardsAddresses,
    balances,
    pairs,
    pairsHaveLoaded,
    earnedAmounts,
    stakingTotalSupplies,
    rewardRates,
    periodFinishes,
    info
  ])
}

export function useTotalPngEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const png = chainId ? PNG[chainId] : undefined
  const stakingInfo0 = useStakingInfo(0)
  const stakingInfo1 = useStakingInfo(1)

  const earned0 = useMemo(() => {
    if (!png) return undefined
    return (
      stakingInfo0?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [stakingInfo0, png])

  const earned1 = useMemo(() => {
    if (!png) return undefined
    return (
      stakingInfo1?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [stakingInfo1, png])

  return earned0 ? (earned1 ? earned0.add(earned1) : earned0) : earned1 ? earned1 : undefined
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = t('stakeHooks.connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? t('stakeHooks.enterAmount')
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = t('stakeHooks.connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? t('stakeHooks.enterAmount')
  }

  return {
    parsedAmount,
    error
  }
}

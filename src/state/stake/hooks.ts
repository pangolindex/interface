import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair } from '@pangolindex/sdk'
import { useMemo } from 'react'
import { PNG, DAI, UNI, SUSHI, ETH, USDT, WBTC, LINK, AAVE, YFI, SNOB, VSO, SPORE, BIFI, BNB } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useTranslation } from 'react-i18next'

export interface Staking {
  tokens: [Token, Token]
  stakingRewardAddress: string
  version: number
}

export interface Migration {
  from: Staking,
  to: Staking
}

const STAKING: {
  [key: string]: Staking;
} = {
  WAVAX_ETH_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xa16381eae6285123c323a665d4d99a6bcfaac307',
    version: 0
  },
  WAVAX_USDT_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4f019452f51bba0250ec8b69d64282b79fc8bd9f',
    version: 0
  },
  WAVAX_WBTC_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x01897e996eefff65ae9999c02d1d8d7e9e0c0352',
    version: 0
  },
  WAVAX_PNG_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x8fd2755c6ae7252753361991bdcd6ff55bdc01ce',
    version: 0
  },
  WAVAX_LINK_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7d7ecd4d370384b17dfc1b4155a8410e97841b65',
    version: 0
  },
  WAVAX_DAI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb5b9ded9c193731f816ae1f8ffb7f8b0fae40c88',
    version: 0
  },
  WAVAX_UNI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe4d9ae03859dac6d65432d557f75b9b588a38ee1',
    version: 0
  },
  WAVAX_SUSHI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x88f26b81c9cae4ea168e31bc6353f493fda29661',
    version: 0
  },
  WAVAX_AAVE_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xee0023108918884181e48902f7c797573f413ece',
    version: 0
  },
  WAVAX_YFI_V0: {
    tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x797cbcf107519f4b279fc5db372e292cdf7e6956',
    version: 0
  },
  PNG_ETH_V0: {
    tokens: [PNG[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4e550fefbf888cb43ead73d821f646f43b1f2309',
    version: 0
  },
  PNG_USDT_V0: {
    tokens: [PNG[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7accc6f16bf8c0dce22371fbd914c6b5b402bf9f',
    version: 0
  },
  PNG_WBTC_V0: {
    tokens: [PNG[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x99b06b9673fea30ba55179b1433ce909fdc28723',
    version: 0
  },
  PNG_LINK_V0: {
    tokens: [PNG[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4ad6e309805cb477010bea9ffc650cb27c1a9504',
    version: 0
  },
  PNG_DAI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x8866077f08b076360c25f4fd7fbc959ef135474c',
    version: 0
  },
  PNG_UNI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x41188b4332fe68135d1524e43db98e81519d263b',
    version: 0
  },
  PNG_SUSHI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6955cb85edea63f861c0be39c3d7f8921606c4dc',
    version: 0
  },
  PNG_AAVE_V0: {
    tokens: [PNG[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xb921a3ae9ceda66fa8a74dbb0946367fb14fae34',
    version: 0
  },
  PNG_YFI_V0: {
    tokens: [PNG[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2061298c76cd76219b9b44439e96a75f19c61f7f',
    version: 0
  },

  WAVAX_ETH_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x417c02150b9a31bcacb201d1d60967653384e1c6',
    version: 1
  },
  WAVAX_USDT_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x94c021845efe237163831dac39448cfd371279d6',
    version: 1
  },
  WAVAX_WBTC_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe968e9753fd2c323c2fe94caff954a48afc18546',
    version: 1
  },
  WAVAX_PNG_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x574d3245e36cf8c9dc86430eadb0fdb2f385f829',
    version: 1
  },
  WAVAX_LINK_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xbda623cdd04d822616a263bf4edbbce0b7dc4ae7',
    version: 1
  },
  WAVAX_DAI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x701e03fad691799a8905043c0d18d2213bbcf2c7',
    version: 1
  },
  WAVAX_UNI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x1f6acc5f5fe6af91c1bb3bebd27f4807a243d935',
    version: 1
  },
  WAVAX_SUSHI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xda354352b03f87f84315eef20cdd83c49f7e812e',
    version: 1
  },
  WAVAX_AAVE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4df32f1f8469648e89e62789f4246f73fe768b8e',
    version: 1
  },
  WAVAX_YFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x2c31822f35506c6444f458ed7470c79f9924ee86',
    version: 1
  },
  WAVAX_SNOB_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SNOB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x640d754113a3cbdd80bccc1b5c0387148eebf2fe',
    version: 1
  },
  WAVAX_VSO_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], VSO[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xf2b788085592380bfCAc40Ac5E0d10D9d0b54eEe',
    version: 1
  },
  WAVAX_SPORE_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], SPORE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xd3e5538A049FcFcb8dF559B85B352302fEfB8d7C',
    version: 1
  },
  WAVAX_BIFI_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], BIFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4E258f7ec60234bb6f3Ea7eCFf5931901182Bd6E',
    version: 1
  },
  WAVAX_BNB_V1: {
    tokens: [WAVAX[ChainId.AVALANCHE], BNB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x21CCa1672E95996413046077B8cf1E52F080A165',
    version: 1
  },
  PNG_ETH_V1: {
    tokens: [PNG[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x7ac007afb5d61f48d1e3c8cc130d4cf6b765000e',
    version: 1
  },
  PNG_USDT_V1: {
    tokens: [PNG[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe2510a1fcccde8d2d1c40b41e8f71fb1f47e5bba',
    version: 1
  },
  PNG_WBTC_V1: {
    tokens: [PNG[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x681047473b6145ba5db90b074e32861549e85cc7',
    version: 1
  },
  PNG_LINK_V1: {
    tokens: [PNG[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x6356b24b36074abe2903f44fe4019bc5864fde36',
    version: 1
  },
  PNG_DAI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xe3103e565cf96a5709ae8e603b1efb7fed04613b',
    version: 1
  },
  PNG_UNI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x4f74bbf6859a994e7c309ea0f11e3cc112955110',
    version: 1
  },
  PNG_SUSHI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x633f4b4db7dd4fa066bd9949ab627a551e0ecd32',
    version: 1
  },
  PNG_AAVE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xfd9acec0f413ca05d5ad5b962f3b4de40018ad87',
    version: 1
  },
  PNG_YFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0xc7d0e29b616b29ac6ff4fd5f37c8da826d16db0d',
    version: 1
  },
  PNG_SNOB_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SNOB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x08b9a023e34bad6db868b699fa642bf5f12ebe76',
    version: 1
  },
  PNG_VSO_V1: {
    tokens: [PNG[ChainId.AVALANCHE], VSO[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x759ee0072901f409e4959E00b00a16FD729397eC',
    version: 1
  },
  PNG_SPORE_V1: {
    tokens: [PNG[ChainId.AVALANCHE], SPORE[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x12A33F6B0dd0D35279D402aB61587fE7eB23f7b0',
    version: 1
  },
  PNG_BIFI_V1: {
    tokens: [PNG[ChainId.AVALANCHE], BIFI[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x518B07E2d9e08A8c2e3cB7704336520827a4d399',
    version: 1
  },
  PNG_BNB_V1: {
    tokens: [PNG[ChainId.AVALANCHE], BNB[ChainId.AVALANCHE]],
    stakingRewardAddress: '0x68a90C38bF4f90AC2a870d6FcA5b0A5A218763AD',
    version: 1
  },
}

// The first mapping in the list takes priority if multiple migrations exist from the same pool
export const MIGRATIONS: Migration[] = [
  { from: STAKING.WAVAX_ETH_V0, to: STAKING.WAVAX_ETH_V1 },
  { from: STAKING.WAVAX_USDT_V0, to: STAKING.WAVAX_USDT_V1 },
  { from: STAKING.WAVAX_WBTC_V0, to: STAKING.WAVAX_WBTC_V1 },
  { from: STAKING.WAVAX_PNG_V0, to: STAKING.WAVAX_PNG_V1 },
  { from: STAKING.WAVAX_LINK_V0, to: STAKING.WAVAX_LINK_V1 },
  { from: STAKING.WAVAX_DAI_V0, to: STAKING.WAVAX_DAI_V1 },
  { from: STAKING.WAVAX_UNI_V0, to: STAKING.WAVAX_UNI_V1 },
  { from: STAKING.WAVAX_SUSHI_V0, to: STAKING.WAVAX_SUSHI_V1 },
  { from: STAKING.WAVAX_AAVE_V0, to: STAKING.WAVAX_AAVE_V1 },
  { from: STAKING.WAVAX_YFI_V0, to: STAKING.WAVAX_YFI_V1 },

  { from: STAKING.PNG_ETH_V0, to: STAKING.PNG_ETH_V1 },
  { from: STAKING.PNG_USDT_V0, to: STAKING.PNG_USDT_V1 },
  { from: STAKING.PNG_WBTC_V0, to: STAKING.PNG_WBTC_V1 },
  { from: STAKING.PNG_LINK_V0, to: STAKING.PNG_LINK_V1 },
  { from: STAKING.PNG_DAI_V0, to: STAKING.PNG_DAI_V1 },
  { from: STAKING.PNG_UNI_V0, to: STAKING.PNG_UNI_V1 },
  { from: STAKING.PNG_SUSHI_V0, to: STAKING.PNG_SUSHI_V1 },
  { from: STAKING.PNG_AAVE_V0, to: STAKING.PNG_AAVE_V1 },
  { from: STAKING.PNG_YFI_V0, to: STAKING.PNG_YFI_V1 },
]

export const STAKING_V0: Staking[] = Object.values(STAKING).filter(staking => staking.version === 0)
export const STAKING_V1: Staking[] = Object.values(STAKING).filter(staking => staking.version === 1)

export const STAKING_REWARDS_INFO: {
	[chainId in ChainId]?: Staking[][]
} = {
	[ChainId.AVALANCHE]: [STAKING_V0, STAKING_V1]
}

export interface StakingInfo {
	// the address of the reward contract
	stakingRewardAddress: string
	// the tokens involved in this pair
	tokens: [Token, Token]
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
	//  total staked Avax in the pool
	totalStakedInWavax: TokenAmount
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

const calculateTotalStakedAmountInAvaxFromPng = function(
  totalSupply: JSBI,
  avaxPngPairReserveOfPng: JSBI,
  avaxPngPairReserveOfOtherToken: JSBI,
  stakingTokenPairReserveOfPng: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  if (JSBI.EQ(totalSupply, JSBI.BigInt(0))) {
    return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.BigInt(0))
  }
  const oneToken = JSBI.BigInt(1000000000000000000)
  const avaxPngRatio = JSBI.divide(JSBI.multiply(oneToken, avaxPngPairReserveOfOtherToken), avaxPngPairReserveOfPng)

  const valueOfPngInAvax = JSBI.divide(JSBI.multiply(stakingTokenPairReserveOfPng, avaxPngRatio), oneToken)

  return new TokenAmount(
    WAVAX[ChainId.AVALANCHE],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(totalStakedAmount.raw, valueOfPngInAvax),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      totalSupply
    )
  )
}

const calculteTotalStakedAmountInAvax = function(
  totalSupply: JSBI,
  reserveInWavax: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  if (JSBI.GT(totalSupply, 0)) {
    // take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
    return new TokenAmount(
      WAVAX[ChainId.AVALANCHE],
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(totalStakedAmount.raw, reserveInWavax),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
        ),
        totalSupply
      )
    )
  } else {
    return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.BigInt(0))
  }
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(version: number, pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.[version]?.filter(stakingRewardInfo =>
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
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')
  const pairs = usePairs(tokens)
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

  return useMemo(() => {
    if (!chainId || !png) return []

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]
      const [pairState, pair] = pairs[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading &&
        pair &&
        avaxPngPair &&
        pairState !== PairState.LOADING &&
        avaxPngPairState !== PairState.LOADING
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
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

				const totalSupply = JSBI.BigInt(totalSupplyState.result?.[0])
				const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
				const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, totalSupply)
				const totalRewardRate = new TokenAmount(png, JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0]))
				const isAvaxPool = tokens[0].equals(WAVAX[tokens[0].chainId])
				const totalStakedInWavax = isAvaxPool ?
					calculteTotalStakedAmountInAvax(totalSupply, pair.reserveOf(wavax).raw, totalStakedAmount) :
					calculateTotalStakedAmountInAvaxFromPng(
						totalSupply, avaxPngPair.reserveOf(png).raw,
						avaxPngPair.reserveOf(WAVAX[tokens[1].chainId]).raw,
						 pair.reserveOf(png).raw, totalStakedAmount
					)

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
					getHypotheticalRewardRate
				})
			}
			return memo
		}, [])
	}, [balances, chainId, earnedAmounts, info, periodFinishes, rewardRates, rewardsAddresses, totalSupplies, avaxPngPairState, pairs, png, avaxPngPair])
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

	return earned0 ? (earned1 ? earned0.add(earned1) : earned0) : (earned1 ? earned1 : undefined)
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

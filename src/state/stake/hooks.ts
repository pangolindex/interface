import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair } from '@pangolindex/sdk'
import { useMemo } from 'react'
import { PNG, DAI, UNI, SUSHI, ETH, USDT, WBTC, LINK, AAVE, YFI } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

export const STAKING_GENESIS = 1600387200

export const REWARDS_DURATION_DAYS = 60

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
	[chainId in ChainId]?: {
		tokens: [Token, Token]
		stakingRewardAddress: string
	}[]
} = {
	[ChainId.AVALANCHE]: [
		{
			tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
			stakingRewardAddress: '0xa16381eae6285123c323a665d4d99a6bcfaac307'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x4f019452f51bba0250ec8b69d64282b79fc8bd9f'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x01897e996eefff65ae9999c02d1d8d7e9e0c0352'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], PNG[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8fd2755c6ae7252753361991bdcd6ff55bdc01ce'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x7d7ecd4d370384b17dfc1b4155a8410e97841b65'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0xb5b9ded9c193731f816ae1f8ffb7f8b0fae40c88'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0xe4d9ae03859dac6d65432d557f75b9b588a38ee1'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x88f26b81c9cae4ea168e31bc6353f493fda29661'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
			stakingRewardAddress: '0xee0023108918884181e48902f7c797573f413ece'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x797cbcf107519f4b279fc5db372e292cdf7e6956'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x4e550fefbf888cb43ead73d821f646f43b1f2309'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x7accc6f16bf8c0dce22371fbd914c6b5b402bf9f'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x99b06b9673fea30ba55179b1433ce909fdc28723'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x4ad6e309805cb477010bea9ffc650cb27c1a9504'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8866077f08b076360c25f4fd7fbc959ef135474c'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x41188b4332fe68135d1524e43db98e81519d263b'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x6955cb85edea63f861c0be39c3d7f8921606c4dc'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
			stakingRewardAddress: '0xb921a3ae9ceda66fa8a74dbb0946367fb14fae34'
		},
		{
			tokens: [PNG[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x2061298c76cd76219b9b44439e96a75f19c61f7f'
		},
	]
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
	totalStakedAmount: TokenAmount,
): TokenAmount
{
	const oneToken = JSBI.BigInt(1000000000000000000)
	const avaxPngRatio = JSBI.divide(JSBI.multiply(oneToken, avaxPngPairReserveOfOtherToken),
	avaxPngPairReserveOfPng)


	const valueOfPngInAvax = JSBI.divide(JSBI.multiply(stakingTokenPairReserveOfPng, avaxPngRatio), oneToken)

	return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.divide(
			JSBI.multiply(
				JSBI.multiply(totalStakedAmount.raw, valueOfPngInAvax),
				JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
			),
			totalSupply
		)
	)
}

const calculteTotalStakedAmountInAvax = function(totalSupply: JSBI, reserveInWavax: JSBI, totalStakedAmount: TokenAmount): TokenAmount
{
	// take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
	return new TokenAmount(WAVAX[ChainId.AVALANCHE], JSBI.divide(
			JSBI.multiply(
				JSBI.multiply(totalStakedAmount.raw, reserveInWavax),
				JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
			),
			totalSupply
		)
	)
}


// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
	const { chainId, account } = useActiveWeb3React()

	const info = useMemo(
		() =>
			chainId
				? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
					pairToFilterBy === undefined
						? true
						: pairToFilterBy === null
							? false
							: pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
							pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
				) ?? []
				: [],
		[chainId, pairToFilterBy]
	)

	const png = chainId ? PNG[chainId] : undefined

	const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

	const accountArg = useMemo(() => [account ?? undefined], [account])

	// get all the info from the staking rewards contracts
	const tokens = useMemo(() => info.map(({tokens}) => tokens), [info])
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
				
				const totalSupply = JSBI.BigInt(totalSupplyState.result?.[0])
				const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
				const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, totalSupply)
				const totalRewardRate = new TokenAmount(png, JSBI.BigInt(rewardRateState.result?.[0]))
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

				const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

				memo.push({
					stakingRewardAddress: rewardsAddress,
					tokens: tokens,
					periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
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
	const stakingInfos = useStakingInfo()

	return useMemo(() => {
		if (!png) return undefined
		return (
			stakingInfos?.reduce(
				(accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
				new TokenAmount(png, '0')
			) ?? new TokenAmount(png, '0')
		)
	}, [stakingInfos, png])
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

	const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

	const parsedAmount =
		parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
			? parsedInput
			: undefined

	let error: string | undefined
	if (!account) {
		error = 'Connect Wallet'
	}
	if (!parsedAmount) {
		error = error ?? 'Enter an amount'
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

	const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

	const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

	let error: string | undefined
	if (!account) {
		error = 'Connect Wallet'
	}
	if (!parsedAmount) {
		error = error ?? 'Enter an amount'
	}

	return {
		parsedAmount,
		error
	}
}
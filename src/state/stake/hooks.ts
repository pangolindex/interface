import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair } from '@pangolindex/sdk'
import { useMemo } from 'react'
import { PNG, DAI, UNI, JOE } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
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
	[ChainId.FUJI]: [
		{
			tokens: [WAVAX[ChainId.FUJI], UNI[ChainId.FUJI]],
			stakingRewardAddress: '0x57f0bf4096419ce89c720467c4abe0dd3f6baf7d'
		},
		{
			tokens: [WAVAX[ChainId.FUJI], JOE[ChainId.FUJI]],
			stakingRewardAddress: '0x787040c7afa1a85d33e199e40c1c897bb7c17487'
		},
		{
			tokens: [WAVAX[ChainId.FUJI], DAI[ChainId.FUJI]],
			stakingRewardAddress: '0x1861834145f4edf757ae0698a820eeb562a9a669'
		},
		{
			tokens: [WAVAX[ChainId.FUJI], PNG[ChainId.FUJI]],
			stakingRewardAddress: '0x89a5bbE037c082563bD1002A78566E4F5f25feA7'
		},
		{
			tokens: [PNG[ChainId.FUJI], JOE[ChainId.FUJI]],
			stakingRewardAddress: '0x7578b8488Bba7d1b49F715F86a77E0e4fd75DEe4'
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
	// when the period ends
	periodFinish: Date | undefined
	// calculates a hypothetical amount of token distributed to the active account per second.
	getHypotheticalRewardRate: (
		stakedAmount: TokenAmount,
		totalStakedAmount: TokenAmount,
		totalRewardRate: TokenAmount
	) => TokenAmount
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
	const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
	const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
	const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

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
				!periodFinishState.loading
			) {
				if (
					balanceState?.error ||
					earnedAmountState?.error ||
					totalSupplyState.error ||
					rewardRateState.error ||
					periodFinishState.error
				) {
					console.error('Failed to load staking rewards info')
					return memo
				}

				// get the LP token
				const tokens = info[index].tokens
				const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)

				// check for account, if no account set to 0

				const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
				const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))
				const totalRewardRate = new TokenAmount(png, JSBI.BigInt(rewardRateState.result?.[0]))

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
					tokens: info[index].tokens,
					periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
					earnedAmount: new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
					rewardRate: individualRewardRate,
					totalRewardRate: totalRewardRate,
					stakedAmount: stakedAmount,
					totalStakedAmount: totalStakedAmount,
					getHypotheticalRewardRate
				})
			}
			return memo
		}, [])
	}, [balances, chainId, earnedAmounts, info, periodFinishes, rewardRates, rewardsAddresses, totalSupplies, png])
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
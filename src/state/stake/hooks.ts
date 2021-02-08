import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair } from '@pangolindex/sdk'
import { useMemo } from 'react'
import { PNG, DAI, UNI, SUSHI, ETH, USDT, WBTC, LINK, AAVE, YFI } from '../../constants'
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
			tokens: [WAVAX[ChainId.AVALANCHE], ETH[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], WBTC[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.FUJI], PNG[ChainId.FUJI]],
			stakingRewardAddress: '0x3d84a98b07510a198cd1f63e172d7a17ab103d46'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], LINK[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], DAI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], UNI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], SUSHI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], AAVE[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [WAVAX[ChainId.AVALANCHE], YFI[ChainId.AVALANCHE]],
			stakingRewardAddress: '0x8cc0183526ab00b2b1f3f4d42ae7821e6af2cbcb'
		},
		{
			tokens: [PNG[ChainId.FUJI], ETH[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], USDT[ChainId.FUJI]],
			stakingRewardAddress: '0x314843d119cd87661e3a8ed0bc197a63aadf92f5'
		},
		{
			tokens: [PNG[ChainId.FUJI], WBTC[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], LINK[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], DAI[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], UNI[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], SUSHI[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], AAVE[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
		},
		{
			tokens: [PNG[ChainId.FUJI], YFI[ChainId.FUJI]],
			stakingRewardAddress: '0xdaceae737d6cb30d477534d4b6d291b6f3b68aae'
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
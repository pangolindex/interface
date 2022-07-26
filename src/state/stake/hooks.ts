import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair, Percent, CHAINS } from '@pangolindex/sdk'
import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import {
  MINICHEF_ADDRESS,
  BIG_INT_ZERO,
  BIG_INT_TWO,
  BIG_INT_ONE,
  BIG_INT_SECONDS_IN_WEEK,
  PANGOLIN_API_BASE_URL,
  ZERO_ADDRESS,
  ONE_TOKEN
} from '../../constants'
import { DAIe, PNG, USDC, USDCe, USDTe, axlUST } from '../../constants/tokens'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import {
  NEVER_RELOAD,
  useMultipleContractSingleData,
  useSingleCallResult,
  useSingleContractMultipleData
} from '../multicall/hooks'
import { tryParseAmount, maxAmountSpend } from 'src/utils'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from '../../constants/abis/rewarderViaMultiplier'
import { useUSDCPrice } from '../../utils/useUSDCPrice'
import { getRouterContract } from '../../utils'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import {
  usePngContract,
  useStakingContract,
  useRewardViaMultiplierContract,
  useMiniChefContract
} from '../../hooks/useContract'
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from './singleSideConfig'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from './doubleSideConfig'
import { unwrappedToken, wrappedCurrencyAmount } from 'src/utils/wrappedCurrency'
import { useTokens } from '../../hooks/Tokens'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { parseUnits, getAddress, splitSignature } from 'ethers/lib/utils'
import { useChainId } from 'src/hooks'
import { mininchefV2Clients } from 'src/apollo/client'
import { GET_MINICHEF } from 'src/apollo/minichef'
import { useQuery } from 'react-query'
import { useDispatch } from 'src/state'
import { AppState, useSelector } from '../index'
import {
  updateMinichefStakingAllData,
  updateMinichefStakingAllAprs,
  updateMinichefStakingAllFarmsEarnedAmount
} from 'src/state/stake/actions'
import usePrevious from 'src/hooks/usePrevious'
import isEqual from 'lodash.isequal'
import { useLibrary, useTranslation } from '@pangolindex/components'
import { PANGOLIN_PAIR_INTERFACE } from 'src/constants/abis/pangolinPair'

export interface SingleSideStaking {
  rewardToken: Token
  conversionRouteHops: Token[]
  stakingRewardAddress: string
  version: number
}

export interface DoubleSideStaking {
  tokens: [Token, Token]
  stakingRewardAddress: string
  version: number
  multiplier?: number
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
  totalRewardRatePerSecond: TokenAmount
  totalRewardRatePerWeek: TokenAmount
  // the current amount of token distributed to the active account per week.
  // equivalent to percent of total supply * reward rate * (60 * 60 * 24 * 7)
  rewardRatePerWeek: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // has the reward period expired
  isPeriodFinished: boolean
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalWeeklyRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRatePerSecond: TokenAmount
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
  totalStakedInUsd: TokenAmount
  rewardTokensAddress?: Array<string>
  rewardsAddress?: string
  rewardTokensMultiplier?: Array<JSBI>
  getExtraTokensWeeklyRewardRate?: (
    rewardRatePerWeek: TokenAmount,
    token: Token,
    tokenMultiplier: JSBI | undefined
  ) => TokenAmount
}

export interface StakingInfo extends DoubleSideStakingInfo {
  swapFeeApr?: number
  stakingApr?: number
  combinedApr?: number
  rewardTokens?: Array<Token>
  pid?: string
}

export interface MinichefStakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  swapFeeApr?: number
  stakingApr?: number
  combinedApr?: number
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the pool weight
  multiplier: JSBI
  totalStakedInUsd: TokenAmount
  // has the reward period expired
  isPeriodFinished: boolean
  rewardTokens?: Array<Token>
  rewardsAddress?: string
  pid: string

  // Extra Fields
  totalStakedInWavax: TokenAmount
  rewardTokensAddress?: Array<string>
  rewardTokensMultiplier?: Array<JSBI>
  getExtraTokensWeeklyRewardRate?: (
    rewardRatePerWeek: TokenAmount,
    token: Token,
    tokenMultiplier: JSBI | undefined
  ) => TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRatePerSecond: TokenAmount
  totalRewardRatePerWeek: TokenAmount
  // equivalent to percent of total supply * reward rate * (60 * 60 * 24 * 7)
  rewardRatePerWeek: TokenAmount
  // when the period ends
  periodFinish: Date | undefined

  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalWeeklyRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRatePerSecond: TokenAmount
  ) => TokenAmount
}

export interface MinichefToken {
  id: string
  symbol: string
  derivedUSD: number
  name: string
  decimals: number
}

export interface MinichefPair {
  id: string
  reserve0: number
  reserve1: number
  totalSupply: number
  token0: MinichefToken
  token1: MinichefToken
}

export interface MinichefFarmReward {
  id: string
  token: MinichefToken
  multiplier: number
}

export interface MinichefFarmRewarder {
  id: string
  rewards: Array<MinichefFarmReward>
}

export interface FarmingPositions {
  id: string
  stakedTokenBalance: number
}

export interface MinichefFarm {
  id: string
  pid: string
  tvl: number
  allocPoint: number
  rewarderAddress: string
  chefAddress: string
  pairAddress: string
  rewarder: MinichefFarmRewarder
  pair: MinichefPair
  farmingPositions: FarmingPositions[]
  earnedAmount?: number
  swapFeeApr?: number
  stakingApr?: number
  combinedApr?: number
}

export interface MinichefV2 {
  id: string
  totalAllocPoint: number
  rewardPerSecond: number
  rewardsExpiration: number
  farms: Array<MinichefFarm>
}

const calculateTotalStakedAmountInAvaxFromPng = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  avaxPngPairReserveOfPng: JSBI,
  avaxPngPairReserveOfWavax: JSBI,
  reserveInPng: JSBI,
  chainId: ChainId
): TokenAmount {
  if (JSBI.EQ(amountAvailable, JSBI.BigInt(0))) {
    return new TokenAmount(WAVAX[chainId], JSBI.BigInt(0))
  }

  const oneToken = JSBI.BigInt(1000000000000000000)
  const avaxPngRatio = JSBI.divide(JSBI.multiply(oneToken, avaxPngPairReserveOfWavax), avaxPngPairReserveOfPng)
  const valueOfPngInAvax = JSBI.divide(JSBI.multiply(reserveInPng, avaxPngRatio), oneToken)

  return new TokenAmount(
    WAVAX[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(amountStaked, valueOfPngInAvax),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      amountAvailable
    )
  )
}

const calculateRewardRateInPng = function(rewardRate: JSBI, valueOfPng: JSBI | null): JSBI {
  if (!valueOfPng || JSBI.EQ(valueOfPng, 0)) return JSBI.BigInt(0)

  // TODO: Handle situation where stakingToken and rewardToken have different decimals
  const oneToken = JSBI.BigInt(1000000000000000000)

  return JSBI.divide(
    JSBI.multiply(rewardRate, oneToken), // Multiply first for precision
    valueOfPng
  )
}

const calculateApr = function(rewardRatePerSecond: JSBI, totalSupply: JSBI): JSBI {
  if (JSBI.EQ(totalSupply, 0)) {
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
  reserveInWavax: JSBI,
  chainId: ChainId
): TokenAmount {
  if (JSBI.GT(amountAvailable, 0)) {
    // take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
    return new TokenAmount(
      WAVAX[chainId],
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(amountStaked, reserveInWavax),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
        ),
        amountAvailable
      )
    )
  } else {
    return new TokenAmount(WAVAX[chainId], JSBI.BigInt(0))
  }
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(version: number, pairToFilterBy?: Pair | null): DoubleSideStakingInfo[] {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

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

  const png = PNG[chainId]

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])
  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const stakingTotalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')
  const pairs = usePairs(tokens)

  const pairAddresses = useMemo(() => {
    const pairsHaveLoaded = pairs?.every(([state]) => state === PairState.EXISTS)
    if (!pairsHaveLoaded) return []
    else return pairs.map(([, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')

  const [avaxPngPairState, avaxPngPair] = usePair(WAVAX[chainId], png)

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

  const usdPriceTmp = useUSDCPrice(WAVAX[chainId])
  const usdPrice = CHAINS[chainId]?.mainnet ? usdPriceTmp : undefined

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
        const totalRewardRatePerSecond = new TokenAmount(
          png,
          JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0])
        )

        const totalRewardRatePerWeek = new TokenAmount(
          png,
          JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_SECONDS_IN_WEEK)
        )

        const isAvaxPool = tokens[0].equals(WAVAX[tokens[0].chainId])
        const totalStakedInWavax = isAvaxPool
          ? calculateTotalStakedAmountInAvax(
              totalSupplyStaked,
              totalSupplyAvailable,
              pair.reserveOf(wavax).raw,
              chainId
            )
          : calculateTotalStakedAmountInAvaxFromPng(
              totalSupplyStaked,
              totalSupplyAvailable,
              avaxPngPair.reserveOf(png).raw,
              avaxPngPair.reserveOf(WAVAX[tokens[1].chainId]).raw,
              pair.reserveOf(png).raw,
              chainId
            )

        const totalStakedInUsd = totalStakedInWavax && (usdPrice?.quote(totalStakedInWavax, chainId) as TokenAmount)

        const getHypotheticalWeeklyRewardRate = (
          _stakedAmount: TokenAmount,
          _totalStakedAmount: TokenAmount,
          totalRewardRatePerSecond: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            png,
            JSBI.greaterThan(_totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRatePerSecond.raw, _stakedAmount.raw), _totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRatePerWeek = getHypotheticalWeeklyRewardRate(
          stakedAmount,
          totalStakedAmount,
          totalRewardRatePerSecond
        )

        const multiplier = info[index].multiplier

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished: isPeriodFinished,
          earnedAmount: new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRatePerWeek: individualRewardRatePerWeek,
          totalRewardRatePerSecond: totalRewardRatePerSecond,
          totalRewardRatePerWeek: totalRewardRatePerWeek,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInWavax: totalStakedInWavax,
          totalStakedInUsd: totalStakedInUsd,
          multiplier: JSBI.BigInt(multiplier ?? 0),
          getHypotheticalWeeklyRewardRate
        })
      }
      return memo
    }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // TODO: Take library from useLibrary
  const { library, account } = useActiveWeb3React()
  const chainId = useChainId()

  const info = useMemo(
    () =>
      SINGLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(stakingRewardInfo =>
        rewardTokenToFilterBy === undefined
          ? true
          : rewardTokenToFilterBy === null
          ? false
          : rewardTokenToFilterBy.equals(stakingRewardInfo.rewardToken)
      ) ?? [],
    [chainId, rewardTokenToFilterBy, version]
  )

  const png = PNG[chainId]

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])
  const routes = useMemo(
    (): string[][] =>
      info.map(({ conversionRouteHops, rewardToken }) => {
        return [png.address, ...conversionRouteHops.map(token => token.address), rewardToken.address]
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }),
    [info, png]
  )

  const accountArg = useMemo(() => [account ?? undefined], [account])
  const getAmountsOutArgs = useMemo(() => {
    const amountIn = '1' + '0'.repeat(18) // 1 PNG
    return routes.map(route => [amountIn, route])
  }, [routes])

  const routerContract = useMemo(() => {
    if (!chainId || !library) return
    return getRouterContract(chainId, library)
  }, [chainId, library])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
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

  const amountsOuts = useSingleContractMultipleData(routerContract, 'getAmountsOut', getAmountsOutArgs, NEVER_RELOAD)

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
      const amountsOutsState = amountsOuts[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        stakingTotalSupplyState?.loading === false &&
        rewardRateState?.loading === false &&
        periodFinishState?.loading === false &&
        amountsOutsState?.loading === false
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          stakingTotalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
          amountsOutsState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        const rewardToken = info[index].rewardToken
        const valueOfPng = JSBI.BigInt(amountsOutsState.result?.[0]?.slice(-1)?.[0] ?? 0)
        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        // periodFinish will be 0 immediately after a reward contract is initialized
        const isPeriodFinished = periodFinishMs === 0 ? false : periodFinishMs < Date.now()

        const totalSupplyStaked = JSBI.BigInt(stakingTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(png, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(png, JSBI.BigInt(totalSupplyStaked))
        const totalRewardRatePerSecond = new TokenAmount(
          rewardToken,
          JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0])
        )

        const totalRewardRatePerWeek = new TokenAmount(
          png,
          JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_SECONDS_IN_WEEK)
        )

        const earnedAmount = new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0))

        const rewardRateInPng = calculateRewardRateInPng(totalRewardRatePerSecond.raw, valueOfPng)

        const apr = isPeriodFinished ? JSBI.BigInt(0) : calculateApr(rewardRateInPng, totalSupplyStaked)

        const getHypotheticalWeeklyRewardRate = (
          _stakedAmount: TokenAmount,
          _totalStakedAmount: TokenAmount,
          _totalRewardRatePerSecond: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            rewardToken,
            JSBI.greaterThan(_totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(
                  JSBI.multiply(
                    JSBI.multiply(_totalRewardRatePerSecond.raw, _stakedAmount.raw),
                    BIG_INT_SECONDS_IN_WEEK
                  ),
                  _totalStakedAmount.raw
                )
              : JSBI.BigInt(0)
          )
        }

        const individualWeeklyRewardRate = getHypotheticalWeeklyRewardRate(
          stakedAmount,
          totalStakedAmount,
          totalRewardRatePerSecond
        )

        memo.push({
          stakingRewardAddress: rewardsAddress,
          rewardToken: rewardToken,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished: isPeriodFinished,
          earnedAmount: earnedAmount,
          rewardRatePerWeek: individualWeeklyRewardRate,
          totalRewardRatePerSecond: totalRewardRatePerSecond,
          totalRewardRatePerWeek: totalRewardRatePerWeek,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInPng: totalStakedAmount,
          getHypotheticalWeeklyRewardRate,
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
    earnedAmounts,
    stakingTotalSupplies,
    rewardRates,
    periodFinishes,
    amountsOuts,
    info
  ])
}

export function useTotalPngEarned(): TokenAmount | undefined {
  const chainId = useChainId()

  const png = PNG[chainId]
  const minichefInfo = useMinichefStakingInfos(2)
  const singleStakingInfo = useSingleSideStakingInfo(0, png)

  const earnedMinichef = useMemo(() => {
    if (!png) return new TokenAmount(png, '0')
    return (
      minichefInfo?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [minichefInfo, png])

  //Get png earned from single side staking
  const earnedSingleStaking = useMemo(() => {
    if (!png) return new TokenAmount(png, '0')
    const pngSingleStaking = singleStakingInfo.filter(stakingInfo => stakingInfo.stakedAmount.token === png)[0]
    return pngSingleStaking ? pngSingleStaking.earnedAmount : new TokenAmount(png, '0')
  }, [png, singleStakingInfo])

  return earnedSingleStaking.add(earnedMinichef)
}

// TODO : need to add logic
export function useNearTotalPngEarned(): TokenAmount | undefined {
  return undefined
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
  const chainId = useChainId()

  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(chainId, typedValue, stakingToken)

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

export function useGetStakingDataWithAPR(version: number) {
  const chainId = useChainId()
  const stakingInfos = useStakingInfo(version)
  const [stakingInfoData, setStakingInfoData] = useState<StakingInfo[]>(stakingInfos)

  useEffect(() => {
    if (stakingInfos?.length > 0) {
      let aprRequest: Promise<Array<{ swapFeeApr: number; stakingApr: number; combinedApr: number }>>
      if (version < 2) {
        aprRequest = Promise.resolve(
          stakingInfos.map(() => ({
            swapFeeApr: 0,
            stakingApr: 0,
            combinedApr: 0
          }))
        )
      } else {
        const pids = stakingInfos.map(stakingInfo => stakingInfo.stakingRewardAddress)
        aprRequest = fetchChunkedAprs(pids, chainId)
      }

      aprRequest
        .then(aprResponses =>
          stakingInfos.map((stakingInfo, i) => ({
            ...stakingInfo,
            ...aprResponses[i]
          }))
        )
        .then(setStakingInfoData)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length, version, chainId])

  return stakingInfoData
}

export function useGetPairDataFromPair(pair: Pair) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const dummyToken = new Token(chainId, ZERO_ADDRESS, 18, 'PNG', 'Pangolin')

  const token0 = pair?.token0 || dummyToken
  const token1 = pair?.token1 || dummyToken

  const usdPriceCurrency0Tmp = useUSDCPrice(token0)
  const usdPriceCurrency0 = CHAINS[chainId]?.mainnet ? usdPriceCurrency0Tmp : undefined
  const usdPriceCurrency1Tmp = useUSDCPrice(token1)
  const usdPriceCurrency1 = CHAINS[chainId]?.mainnet ? usdPriceCurrency1Tmp : undefined

  const zeroTokenAmount0 = new TokenAmount(token0, '0')
  const zeroTokenAmount1 = new TokenAmount(token1, '0')

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const getHypotheticalPoolOwnership = (userBalance: JSBI | undefined, poolTotalBalance: JSBI | undefined): Percent => {
    if (!userBalance || !poolTotalBalance || JSBI.equal(poolTotalBalance, BIG_INT_ZERO)) {
      return new Percent(BIG_INT_ZERO, BIG_INT_ONE)
    }
    return new Percent(userBalance, poolTotalBalance).multiply('100')
  }

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [zeroTokenAmount0, zeroTokenAmount1]

  const usdAmountCurrency0: CurrencyAmount = usdPriceCurrency0?.quote(token0Deposited, chainId) ?? zeroTokenAmount0
  const usdAmountCurrency1: CurrencyAmount = usdPriceCurrency1?.quote(token1Deposited, chainId) ?? zeroTokenAmount1

  const totalAmountUsd: CurrencyAmount = usdAmountCurrency0?.add(usdAmountCurrency1)

  return {
    currency0: pair.token0,
    currency1: pair.token1,
    userPoolBalance: userPoolBalance,
    totalPoolTokens: totalPoolTokens,
    token0Deposited: token0Deposited,
    token1Deposited: token1Deposited,
    totalAmountUsd: totalAmountUsd,
    poolTokenPercentage: poolTokenPercentage,
    getHypotheticalPoolOwnership
  }
}

export const useMinichefPools = (): { [key: string]: number } => {
  const minichefContract = useMiniChefContract()
  const lpTokens = useSingleCallResult(minichefContract, 'lpTokens', []).result
  const lpTokensArr = lpTokens?.[0]

  return useMemo(() => {
    const poolMap: { [key: string]: number } = {}
    if (lpTokensArr) {
      lpTokensArr.forEach((address: string, index: number) => {
        poolMap[address] = index
      })
    }
    return poolMap
  }, [lpTokensArr])
}

export const tokenComparator = (
  { address: addressA }: { address: string },
  { address: addressB }: { address: string }
) => {
  // Sort AVAX last
  if (addressA === WAVAX[ChainId.AVALANCHE].address) return 1
  else if (addressB === WAVAX[ChainId.AVALANCHE].address) return -1
  // Sort PNG first
  else if (addressA === PNG[ChainId.AVALANCHE].address) return -1
  else if (addressB === PNG[ChainId.AVALANCHE].address) return 1
  // Sort axlUST first
  else if (addressA === axlUST[ChainId.AVALANCHE].address) return -1
  else if (addressB === axlUST[ChainId.AVALANCHE].address) return 1
  // Sort USDC first
  else if (addressA === USDC[ChainId.AVALANCHE].address) return -1
  else if (addressB === USDC[ChainId.AVALANCHE].address) return 1
  // Sort USDCe first
  else if (addressA === USDCe[ChainId.AVALANCHE].address) return -1
  else if (addressB === USDCe[ChainId.AVALANCHE].address) return 1
  else return 0
}

export const getExtraTokensWeeklyRewardRate = (
  rewardRatePerWeek: TokenAmount,
  token: Token,
  tokenMultiplier: JSBI | undefined
) => {
  const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

  const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1)

  const unadjustedRewardPerWeek = JSBI.multiply(rewardMultiplier, rewardRatePerWeek?.raw)

  const finalReward = JSBI.divide(unadjustedRewardPerWeek, TEN_EIGHTEEN)

  return new TokenAmount(token, finalReward)
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const useDummyMinichefHook = (version?: number, pairToFilterBy?: Pair | null) => {
  return [] as StakingInfo[]
}

export const useMinichefStakingInfos = (version = 2, pairToFilterBy?: Pair | null): StakingInfo[] => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const minichefContract = useMiniChefContract()
  const poolMap = useMinichefPools()
  const png = PNG[chainId]
  const lpTokens = Object.keys(poolMap)

  // if chain is not avalanche skip the first pool because it's dummyERC20
  if (chainId !== ChainId.AVALANCHE) {
    lpTokens.shift()
  }

  const _tokens0Call = useMultipleContractSingleData(lpTokens, PANGOLIN_PAIR_INTERFACE, 'token0', [])
  const _tokens1Call = useMultipleContractSingleData(lpTokens, PANGOLIN_PAIR_INTERFACE, 'token1', [])

  const tokens0Adrr = useMemo(() => {
    return _tokens0Call.map(result => {
      return result.result && result.result.length > 0 ? result.result[0] : null
    })
  }, [_tokens0Call])

  const tokens1Adrr = useMemo(() => {
    return _tokens1Call.map(result => (result.result && result.result.length > 0 ? result.result[0] : null))
  }, [_tokens1Call])

  const tokens0 = useTokens(tokens0Adrr)
  const tokens1 = useTokens(tokens1Adrr)

  const info = useMemo(() => {
    const filterPair = (item: DoubleSideStaking) => {
      if (pairToFilterBy === undefined) {
        return true
      }
      if (pairToFilterBy === null) {
        return false
      }
      return pairToFilterBy.involvesToken(item.tokens[0]) && pairToFilterBy.involvesToken(item.tokens[1])
    }

    if (DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]) {
      return DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(filterPair)
    }
    const _infoTokens: DoubleSideStaking[] = []
    if (tokens0 && tokens1 && tokens0?.length === tokens1?.length) {
      tokens0.forEach((token0, index) => {
        const token1 = tokens1[index]
        if (token0 && token1) {
          _infoTokens.push({
            tokens: [token0, token1],
            stakingRewardAddress: minichefContract?.address ?? '',
            version: version
          })
        }
      })
      return _infoTokens.filter(filterPair)
    }
    return _infoTokens
  }, [chainId, minichefContract, tokens0, tokens1, pairToFilterBy, version])

  const _tokens = useMemo(() => (info ? info.map(({ tokens }) => tokens) : []), [info])
  const pairs = usePairs(_tokens)
  // @dev: If no farms load, you likely loaded an incorrect config from doubleSideConfig.js
  // Enable this and look for an invalid pair
  // console.log(pairs)

  const pairAddresses = useMemo(() => {
    return pairs.map(([, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')
  const balances = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'balanceOf', [
    MINICHEF_ADDRESS[chainId]
  ])

  const [avaxPngPairState, avaxPngPair] = usePair(WAVAX[chainId], png)

  const poolIdArray = useMemo(() => {
    if (!pairAddresses || !poolMap) return []
    // TODO: clean up this logic. seems like a lot of work to ensure correct types
    const NOT_FOUND = -1
    const results = pairAddresses.map(address => poolMap[address ?? ''] ?? NOT_FOUND)
    if (results.some(result => result === NOT_FOUND)) return []
    return results
  }, [poolMap, pairAddresses])

  const poolsIdInput = useMemo(() => {
    if (!poolIdArray) return []
    return poolIdArray.map(pid => [pid])
  }, [poolIdArray])

  const poolInfos = useSingleContractMultipleData(minichefContract, 'poolInfo', poolsIdInput ?? [])

  const rewarders = useSingleContractMultipleData(minichefContract, 'rewarder', poolsIdInput ?? [])

  const userInfoInput = useMemo(() => {
    if (!poolIdArray || !account) return []
    return poolIdArray.map(pid => [pid, account])
  }, [poolIdArray, account])

  const userInfos = useSingleContractMultipleData(minichefContract, 'userInfo', userInfoInput ?? [])

  const pendingRewards = useSingleContractMultipleData(minichefContract, 'pendingReward', userInfoInput ?? [])

  const rewardsAddresses = useMemo(() => {
    if ((rewarders || []).length === 0) return []
    if (rewarders.some(item => item.loading)) return []
    return rewarders.map(reward => reward?.result?.[0])
  }, [rewarders])

  const rewardTokensAddresses = useMultipleContractSingleData(
    rewardsAddresses,
    REWARDER_VIA_MULTIPLIER_INTERFACE,
    'getRewardTokens',
    []
  )

  const rewardTokensMultipliers = useMultipleContractSingleData(
    rewardsAddresses,
    REWARDER_VIA_MULTIPLIER_INTERFACE,
    'getRewardMultipliers',
    []
  )

  const rewardPerSecond = useSingleCallResult(minichefContract, 'rewardPerSecond', []).result
  const totalAllocPoint = useSingleCallResult(minichefContract, 'totalAllocPoint', []).result
  const rewardsExpiration = useSingleCallResult(minichefContract, 'rewardsExpiration', []).result
  const usdPriceTmp = useUSDCPrice(WAVAX[chainId])
  const usdPrice = CHAINS[chainId]?.mainnet ? usdPriceTmp : undefined

  const arr = useMemo(() => {
    if (!chainId || !png) return []

    return pairAddresses.reduce<any[]>((memo, _pairAddress, index) => {
      const pairTotalSupplyState = pairTotalSupplies[index]
      const balanceState = balances[index]
      const poolInfo = poolInfos[index]
      const userPoolInfo = userInfos[index]
      const [pairState, pair] = pairs[index]
      const pendingRewardInfo = pendingRewards[index]
      const rewardTokensAddress = rewardTokensAddresses[index]
      const rewardTokensMultiplier = rewardTokensMultipliers[index]
      const rewardsAddress = rewardsAddresses[index]

      if (
        pairTotalSupplyState?.loading === false &&
        poolInfo?.loading === false &&
        balanceState?.loading === false &&
        pair &&
        avaxPngPair &&
        pairState !== PairState.LOADING &&
        avaxPngPairState !== PairState.LOADING &&
        rewardPerSecond &&
        totalAllocPoint &&
        rewardsExpiration?.[0] &&
        rewardTokensAddress?.loading === false
      ) {
        if (
          balanceState?.error ||
          pairTotalSupplyState.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS ||
          avaxPngPairState === PairState.INVALID ||
          avaxPngPairState === PairState.NOT_EXISTS
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }
        const pid = poolMap[pair.liquidityToken.address].toString()
        // get the LP token
        const token0 = pair?.token0
        const token1 = pair?.token1

        const tokens = [token0, token1].sort(tokenComparator)

        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
        const lpToken = dummyPair.liquidityToken

        const poolAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(poolInfo?.result?.['allocPoint']))
        const totalAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(totalAllocPoint?.[0]))
        const rewardRatePerSecAmount = new TokenAmount(png, JSBI.BigInt(rewardPerSecond?.[0]))
        const poolRewardRate = new TokenAmount(
          png,
          JSBI.divide(JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw), totalAllocPointAmount.raw)
        )

        const totalRewardRatePerWeek = new TokenAmount(png, JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK))

        const periodFinishMs = rewardsExpiration?.[0]?.mul(1000)?.toNumber()
        // periodFinish will be 0 immediately after a reward contract is initialized
        const isPeriodFinished =
          periodFinishMs === 0 ? false : periodFinishMs < Date.now() || poolAllocPointAmount.equalTo('0')

        const totalSupplyStaked = JSBI.BigInt(balanceState?.result?.[0])
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState?.result?.[0])
        const totalStakedAmount = new TokenAmount(lpToken, JSBI.BigInt(balanceState?.result?.[0]))
        const stakedAmount = new TokenAmount(lpToken, JSBI.BigInt(userPoolInfo?.result?.['amount'] ?? 0))
        const earnedAmount = new TokenAmount(png, JSBI.BigInt(pendingRewardInfo?.result?.['pending'] ?? 0))
        const multiplier = JSBI.BigInt(poolInfo?.result?.['allocPoint'])

        const isAvaxPool = pair.involvesToken(WAVAX[chainId])
        const isPngPool = pair.involvesToken(PNG[chainId])

        let totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
          ? new TokenAmount(DAIe[chainId], BIG_INT_ZERO)
          : undefined
        const totalStakedInWavax = new TokenAmount(WAVAX[chainId], BIG_INT_ZERO)

        if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
          // Default to 0 values above avoiding division by zero errors
        } else if (pair.involvesToken(DAIe[chainId])) {
          const pairValueInDAI = JSBI.multiply(pair.reserveOf(DAIe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInDAI = JSBI.divide(JSBI.multiply(pairValueInDAI, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? new TokenAmount(DAIe[chainId], stakedValueInDAI)
            : undefined
        } else if (pair.involvesToken(USDCe[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDCe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? new TokenAmount(USDCe[chainId], stakedValueInUSDC)
            : undefined
        } else if (pair.involvesToken(USDC[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDC[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? new TokenAmount(USDC[chainId], stakedValueInUSDC)
            : undefined
        } else if (pair.involvesToken(axlUST[chainId])) {
          const pairValueInUST = JSBI.multiply(pair.reserveOf(axlUST[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUST = JSBI.divide(JSBI.multiply(pairValueInUST, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? new TokenAmount(axlUST[chainId], stakedValueInUST)
            : undefined
        } else if (pair.involvesToken(USDTe[chainId])) {
          const pairValueInUSDT = JSBI.multiply(pair.reserveOf(USDTe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDT = JSBI.divide(JSBI.multiply(pairValueInUSDT, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? new TokenAmount(USDTe[chainId], stakedValueInUSDT)
            : undefined
        } else if (isAvaxPool) {
          const _totalStakedInWavax = calculateTotalStakedAmountInAvax(
            totalSupplyStaked,
            totalSupplyAvailable,
            pair.reserveOf(WAVAX[chainId]).raw,
            chainId
          )
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? _totalStakedInWavax && (usdPrice?.quote(_totalStakedInWavax, chainId) as TokenAmount)
            : undefined
        } else if (isPngPool) {
          const _totalStakedInWavax = calculateTotalStakedAmountInAvaxFromPng(
            totalSupplyStaked,
            totalSupplyAvailable,
            avaxPngPair.reserveOf(png).raw,
            avaxPngPair.reserveOf(WAVAX[chainId]).raw,
            pair.reserveOf(png).raw,
            chainId
          )
          totalStakedInUsd = CHAINS[chainId || ChainId].mainnet
            ? _totalStakedInWavax && (usdPrice?.quote(_totalStakedInWavax, chainId) as TokenAmount)
            : undefined
        } else {
          // Contains no stablecoin, WAVAX, nor PNG
          console.error(`Could not identify total staked value for pair ${pair.liquidityToken.address}`)
        }

        const getHypotheticalWeeklyRewardRate = (
          _stakedAmount: TokenAmount,
          _totalStakedAmount: TokenAmount,
          _totalRewardRatePerSecond: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            png,
            JSBI.greaterThan(_totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(
                  JSBI.multiply(
                    JSBI.multiply(_totalRewardRatePerSecond.raw, _stakedAmount.raw),
                    BIG_INT_SECONDS_IN_WEEK
                  ),
                  _totalStakedAmount.raw
                )
              : JSBI.BigInt(0)
          )
        }

        const userRewardRatePerWeek = getHypotheticalWeeklyRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)

        memo.push({
          pid,
          stakingRewardAddress: MINICHEF_ADDRESS[chainId],
          tokens,
          earnedAmount,
          rewardRatePerWeek: userRewardRatePerWeek,
          totalRewardRatePerSecond: poolRewardRate,
          totalRewardRatePerWeek: totalRewardRatePerWeek,
          stakedAmount,
          totalStakedAmount,
          totalStakedInWavax,
          totalStakedInUsd,
          multiplier: JSBI.divide(multiplier, JSBI.BigInt(100)),
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished,
          getHypotheticalWeeklyRewardRate,
          getExtraTokensWeeklyRewardRate,
          rewardTokensAddress: rewardTokensAddress?.result?.[0],
          rewardTokensMultiplier: rewardTokensMultiplier?.result?.[0],
          rewardsAddress
        })
      }

      return memo
    }, [])
  }, [
    chainId,
    png,
    pairTotalSupplies,
    poolInfos,
    userInfos,
    pairs,
    avaxPngPair,
    avaxPngPairState,
    rewardPerSecond,
    totalAllocPoint,
    pendingRewards,
    rewardsExpiration,
    balances,
    usdPrice,
    pairAddresses,
    rewardTokensAddresses,
    rewardsAddresses,
    rewardTokensMultipliers,
    poolMap
  ])
  return arr
}

export const useMinichefStakingInfosMapping: {
  [chainId in ChainId]: (version?: number, pairToFilterBy?: Pair | null) => StakingInfo[]
} = {
  [ChainId.FUJI]: useMinichefStakingInfos,
  [ChainId.AVALANCHE]: useDummyMinichefHook,
  [ChainId.WAGMI]: useMinichefStakingInfos,
  [ChainId.COSTON]: useMinichefStakingInfos,
  [ChainId.NEAR_MAINNET]: useDummyMinichefHook,
  [ChainId.NEAR_TESTNET]: useDummyMinichefHook
}

export function useGetPoolDollerWorth(pair: Pair | null) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const token0 = pair?.token0
  const currency0 = unwrappedToken(token0 as Token, chainId)
  const currency0PriceTmp = useUSDCPrice(currency0)
  const currency0Price = CHAINS[chainId]?.mainnet ? currency0PriceTmp : undefined

  const userPglTmp = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const userPgl = CHAINS[chainId]?.mainnet ? userPglTmp : undefined

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const [token0Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPgl &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPgl.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPgl, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPgl, false)
        ]
      : [undefined, undefined]

  const liquidityInUSD = CHAINS[chainId]?.mainnet
    ? currency0Price && token0Deposited
      ? Number(currency0Price.toFixed()) * 2 * Number(token0Deposited?.toSignificant(6))
      : 0
    : 0
  //
  return useMemo(
    () => ({
      userPgl,
      liquidityInUSD
    }),
    [userPgl, liquidityInUSD]
  )
}

export function useMinichefPendingRewards(miniChefStaking: StakingInfo | null) {
  const { account } = useActiveWeb3React()

  const rewardData = useRef(
    {} as {
      rewardTokensAmount: TokenAmount[]
      rewardTokensMultiplier: any
    }
  )

  const rewardAddress = miniChefStaking?.rewardsAddress
  const rewardContract = useRewardViaMultiplierContract(rewardAddress !== ZERO_ADDRESS ? rewardAddress : undefined)
  const getRewardTokensRes = useSingleCallResult(rewardContract, 'getRewardTokens', undefined)
  const getRewardMultipliersRes = useSingleCallResult(rewardContract, 'getRewardMultipliers', undefined)
  const { earnedAmount } = useGetEarnedAmount(miniChefStaking?.pid as string)

  const rewardTokensAddress = getRewardTokensRes?.result?.[0]
  const rewardTokensMultiplier = getRewardMultipliersRes?.result?.[0]
  const earnedAmountStr = earnedAmount ? JSBI.BigInt(earnedAmount?.raw).toString() : JSBI.BigInt(0).toString()

  const pendingTokensRes = useSingleContractMultipleData(
    rewardContract,
    'pendingTokens',
    account ? [[0, account as string, earnedAmountStr]] : []
  )

  const isLoading = pendingTokensRes?.[0]?.loading
  const rewardTokens = useTokens(rewardTokensAddress)

  const rewardAmounts = pendingTokensRes?.[0]?.result?.amounts || [] // eslint-disable-line react-hooks/exhaustive-deps

  const rewardTokensAmount = useMemo(() => {
    if (!rewardTokens) return []

    return rewardTokens.map((rewardToken, index) => new TokenAmount(rewardToken as Token, rewardAmounts[index] || 0))
  }, [rewardAmounts, rewardTokens])

  useEffect(() => {
    if (!isLoading) {
      rewardData.current = {
        rewardTokensAmount,
        rewardTokensMultiplier
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardTokensAmount, rewardTokensMultiplier, isLoading])

  return rewardData.current
}

export function useDerivedStakingProcess(stakingInfo: SingleSideStakingInfo) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { library, provider } = useLibrary()
  const { t } = useTranslation()
  const png = PNG[chainId]

  const usdcPrice = useUSDCPrice(png)

  // detect existing unstaked position to show purchase button if none found
  const userPngUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  const stakeToken = stakingInfo?.stakedAmount?.token?.symbol

  const [stepIndex, setStepIndex] = useState(4)

  // track and parse user input
  const [typedValue, setTypedValue] = useState((userPngUnstaked as TokenAmount)?.toExact() || '')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, userPngUnstaked)
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalRewardRatePerWeek: TokenAmount = new TokenAmount(stakingInfo.rewardRatePerWeek.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalRewardRatePerWeek = stakingInfo.getHypotheticalWeeklyRewardRate(
      stakingInfo.stakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalRewardRatePerSecond
    )
  }

  const dollerWorth =
    userPngUnstaked?.greaterThan('0') && usdcPrice ? Number(typedValue) * Number(usdcPrice.toFixed()) : undefined

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setSignatureData(null)
    setTypedValue('0')
    setStepIndex(0)
    setHash(undefined)
    setAttempting(false)
    // onClose && onClose()
  }, [])

  const stakingTokenContract = usePngContract()

  // approval data for stake
  const deadline = useTransactionDeadline()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(chainId, parsedAmount, stakingInfo.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onStake() {
    setAttempting(true)
    if (stakingContract && parsedAmount && deadline) {
      if (approval === ApprovalState.APPROVED) {
        stakingContract
          .stake(`0x${parsedAmount.raw.toString(16)}`)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earnPage.stakeStakingTokens', { symbol: 'PNG' })
            })
            setHash(response.hash)
          })
          .catch((err: any) => {
            setAttempting(false)
            // we only care if the error is something _other_ than the user rejected the tx
            if (err?.code !== 4001) {
              console.error(err)
            }
          })
      } else if (signatureData) {
        stakingContract
          .stakeWithPermit(
            `0x${parsedAmount.raw.toString(16)}`,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s
          )
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earnPage.stakeStakingTokens', { symbol: 'PNG' })
            })
            setHash(response.hash)
          })
          .catch((err: any) => {
            setAttempting(false)
            // we only care if the error is something _other_ than the user rejected the tx
            if (err?.code !== 4001) {
              console.error(err)
            }
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    }
  }

  const onChangePercentage = (value: number) => {
    // setStepIndex(value)
    if (!userPngUnstaked) {
      setTypedValue('0')
      return
    }
    if (value === 100) {
      setTypedValue((userPngUnstaked as TokenAmount).toExact())
    } else if (value === 0) {
      setTypedValue('0')
    } else {
      const newAmount = (userPngUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(value))
        .divide(JSBI.BigInt(100)) as TokenAmount

      setTypedValue(newAmount.toSignificant(6))
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((_typedValue: string) => {
    setSignatureData(null)
    setTypedValue(_typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(chainId, userPngUnstaked)

  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
    setStepIndex(4)
  }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!stakingTokenContract || !library || !deadline) throw new Error(t('earn.missingDependencies'))
    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    // try to gather a signature for permission
    const nonce = await stakingTokenContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pangolin',
      chainId: chainId,
      verifyingContract: stakingTokenContract.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: stakingInfo.stakingRewardAddress,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })
    ;(provider as any)
      .execute('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature: any) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch((err: any) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
  }

  return useMemo(
    () => ({
      attempting,
      stakeToken,
      parsedAmount,
      hash,
      userPngUnstaked,
      stepIndex,
      dollerWorth,
      hypotheticalRewardRatePerWeek,
      signatureData,
      error,
      approval,
      account,
      png,
      onAttemptToApprove,
      onUserInput,
      wrappedOnDismiss,
      handleMax,
      onStake,
      onChangePercentage,
      setStepIndex
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      attempting,
      stakeToken,
      parsedAmount,
      hash,
      userPngUnstaked,
      stepIndex,
      dollerWorth,
      hypotheticalRewardRatePerWeek,
      signatureData,
      error,
      approval,
      account,
      png,
      onUserInput,
      handleMax
    ]
  )
}

export const fetchMinichefData = (account: string, chainId: ChainId) => async () => {
  const mininchefV2Client = mininchefV2Clients[chainId]
  if (!mininchefV2Client) {
    return null
  }
  const { minichefs } = await mininchefV2Client.request(GET_MINICHEF, { userAddress: account })
  return minichefs
}

export function useGetAllFarmData() {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const allFarms = useQuery(['get-minichef-farms-v2', account], fetchMinichefData(account || '', chainId), {
    refetchInterval: 1000 * 60 * 5 // 5 minutes
  })

  const dispatch = useDispatch()

  useEffect(() => {
    if (!allFarms?.isLoading) {
      dispatch(
        updateMinichefStakingAllData({
          data: {
            chainId: chainId,
            data: allFarms?.data?.[0]
          }
        })
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFarms?.data, allFarms?.isLoading])
}

export function useAllMinichefStakingInfoData(): MinichefV2 | undefined {
  const chainId = useChainId()
  return useSelector<AppState['stake']['minichefStakingData'][ChainId.AVALANCHE]>(
    state => state?.stake?.minichefStakingData?.[chainId] || {}
  )
}

// get data for all farms
export const useGetMinichefStakingInfosViaSubgraph = (): MinichefStakingInfo[] => {
  const minichefData = useAllMinichefStakingInfoData()

  const farms = minichefData?.farms

  const chainId = useChainId()
  const png = PNG[chainId]

  const rewardsExpiration = minichefData?.rewardsExpiration
  const totalAllocPoint = minichefData?.totalAllocPoint
  const rewardPerSecond = minichefData?.rewardPerSecond

  return useMemo(() => {
    if (!chainId || !png || !farms?.length) return []

    return farms.reduce(function(memo: any, farm: MinichefFarm) {
      const rewardsAddress = farm?.rewarderAddress

      const rewardsAddresses = farm.rewarder.rewards

      const pair = farm.pair

      const axlUSTToken = axlUST[chainId]
      const axlUSTAddress = axlUSTToken.address

      const pairToken0 = pair?.token0

      const token0 = new Token(
        chainId,
        getAddress(pairToken0.id),
        Number(pairToken0.decimals),
        axlUSTAddress.toLowerCase() === pairToken0.id.toLowerCase() ? axlUSTToken.symbol : pairToken0.symbol,
        pairToken0.name
      )

      const pairToken1 = pair?.token1
      const token1 = new Token(
        chainId,
        getAddress(pairToken1.id),
        Number(pairToken1.decimals),
        axlUSTAddress.toLowerCase() === pairToken1.id.toLowerCase() ? axlUSTToken.symbol : pairToken1.symbol,
        pairToken1.name
      )

      const tokens = [token0, token1].sort(tokenComparator)

      const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
      const lpToken = dummyPair.liquidityToken

      const poolAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(farm?.allocPoint))

      const totalAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(totalAllocPoint ?? 0))
      const rewardRatePerSecAmount = new TokenAmount(png, JSBI.BigInt(rewardPerSecond ?? 0))
      const poolRewardRate = new TokenAmount(
        png,
        JSBI.divide(JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw), totalAllocPointAmount.raw)
      )

      const totalRewardRatePerWeek = new TokenAmount(png, JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK))

      const periodFinishMs = (rewardsExpiration || 0) * 1000
      // periodFinish will be 0 immediately after a reward contract is initialized
      const isPeriodFinished =
        periodFinishMs === 0 ? false : periodFinishMs < Date.now() || poolAllocPointAmount.equalTo('0')

      const minichefTvl = parseUnits(farm?.tvl?.toString())
      const totalSupplyReserve0 = parseUnits(farm?.pair?.reserve0.toString())
      const totalSupply = parseUnits(
        farm?.pair?.totalSupply.toString() === '0' ? '1' : farm?.pair?.totalSupply.toString()
      )
      const token0derivedUSD = parseUnits(Number(farm?.pair?.token0?.derivedUSD)?.toFixed(10))
      const pairTokenValueInUSD = token0derivedUSD.mul(parseUnits('2'))
      const calculatedStakedUsdValue = minichefTvl.mul(totalSupplyReserve0).div(totalSupply)
      // we have 2 10^18, so we need to divide ONE_TOKEN 2 times
      const finalStakedValueInUSD = pairTokenValueInUSD
        .mul(calculatedStakedUsdValue)
        .div(ONE_TOKEN.toString())
        .div(ONE_TOKEN.toString())
      const totalStakedAmount = new TokenAmount(lpToken, minichefTvl.toString() || JSBI.BigInt(0))
      const totalStakedInUsd = new TokenAmount(lpToken, finalStakedValueInUSD.toString() || JSBI.BigInt(0))

      const stakedAmount = new TokenAmount(
        lpToken,
        parseUnits(farm?.farmingPositions?.[0]?.stakedTokenBalance?.toString() ?? '0').toString()
      )
      const earnedAmount = new TokenAmount(png, JSBI.BigInt(farm?.earnedAmount ?? 0))

      const multiplier = JSBI.BigInt(farm?.allocPoint)

      const pid = farm?.pid

      const rewardTokens = rewardsAddresses.map((rewardToken: MinichefFarmReward) => {
        const tokenObj = rewardToken.token
        return new Token(chainId, getAddress(tokenObj.id), tokenObj.decimals, tokenObj.symbol, tokenObj.name)
      })

      const getHypotheticalWeeklyRewardRate = (
        _stakedAmount: TokenAmount,
        _totalStakedAmount: TokenAmount,
        _totalRewardRatePerSecond: TokenAmount
      ): TokenAmount => {
        return new TokenAmount(
          png,
          JSBI.greaterThan(_totalStakedAmount.raw, JSBI.BigInt(0))
            ? JSBI.divide(
                JSBI.multiply(JSBI.multiply(_totalRewardRatePerSecond.raw, _stakedAmount.raw), BIG_INT_SECONDS_IN_WEEK),
                _totalStakedAmount.raw
              )
            : JSBI.BigInt(0)
        )
      }

      const userRewardRatePerWeek = getHypotheticalWeeklyRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)

      memo.push({
        stakingRewardAddress: MINICHEF_ADDRESS[chainId],
        pid,
        tokens,
        multiplier,
        isPeriodFinished,
        totalStakedAmount,
        totalStakedInUsd,
        rewardRatePerWeek: userRewardRatePerWeek,
        totalRewardRatePerSecond: poolRewardRate,
        totalRewardRatePerWeek: totalRewardRatePerWeek,
        getHypotheticalWeeklyRewardRate,
        getExtraTokensWeeklyRewardRate,
        stakedAmount,
        earnedAmount,
        rewardsAddress,
        rewardsAddresses,
        rewardTokens
      })

      return memo
    }, [])
  }, [chainId, png, rewardPerSecond, totalAllocPoint, rewardsExpiration, farms])
}

export const useGetMinichefPids = () => {
  const chainId = useChainId()
  const farms = useSelector<AppState['stake']['minichefStakingData'][ChainId.AVALANCHE]['farms']>(
    state => state?.stake?.minichefStakingData[chainId]?.farms || []
  )
  return useMemo(() => farms?.map(farm => farm?.pid), [farms])
}

export const useGetFarmApr = (pid: string) => {
  const chainId = useChainId()
  const swapFeeApr = useSelector<number>(state => state?.stake?.aprs?.[chainId]?.[pid]?.swapFeeApr)
  const combinedApr = useSelector<number>(state => state?.stake?.aprs?.[chainId]?.[pid]?.combinedApr)
  const stakingApr = useSelector<number>(state => state?.stake?.aprs?.[chainId]?.[pid]?.stakingApr)

  return useMemo(
    () => ({
      swapFeeApr,
      combinedApr,
      stakingApr
    }),
    [swapFeeApr, combinedApr, stakingApr]
  )
}

export const useSortFarmAprs = () => {
  const chainId = useChainId()
  const aprs = useSelector<AppState['stake']['aprs'][ChainId.AVALANCHE]>(state => state?.stake?.aprs?.[chainId])

  return useMemo(() => (aprs ? Object.values(aprs).sort((a, b) => b.combinedApr - a.combinedApr) : []), [aprs])
}

// Each APR request performs an upper bound of (6 + 11n) subrequests where n = pid count
// API requests cannot exceed 50 subrequests and therefore `chunkSize` is set to 4
// ie (6 + 11(4)) = 50
export const fetchChunkedAprs = async (pids: string[], chainId: ChainId, chunkSize = 4) => {
  interface AprResult {
    swapFeeApr: number
    stakingApr: number
    combinedApr: number
  }

  const pidChunks: string[][] = []

  for (let i = 0; i < pids.length; i += chunkSize) {
    const pidChunk = pids.slice(i, i + chunkSize)
    pidChunks.push(pidChunk)
  }

  const chunkedResults = await Promise.all<AprResult[]>(
    pidChunks.map(chunk =>
      fetch(`${PANGOLIN_API_BASE_URL}/v2/${chainId}/pangolin/aprs/${chunk.join(',')}`).then(res => res.json())
    )
  )

  return chunkedResults.flat()
}

export function useFetchFarmAprs() {
  const chainId = useChainId()
  const pids = useGetMinichefPids()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!chainId || !pids || pids.length === 0) return

    fetchChunkedAprs(pids, chainId).then(res => {
      const newResult = res.reduce(
        (acc, value: any, i) => ({ ...acc, [pids[i] as string]: { ...value, pid: pids[i] } }),
        {}
      )

      if (res.length > 0) {
        dispatch(
          updateMinichefStakingAllAprs({
            data: { chainId: chainId, data: newResult }
          })
        )
      }
    })
  }, [pids, chainId, dispatch])
}

export function useUpdateAllFarmsEarnAmount() {
  const poolIdArray = useGetMinichefPids()
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId])

  const dispatch = useDispatch()

  const userInfoInput = useMemo(() => {
    if (!poolIdArray || !account) return []
    return poolIdArray.map(pid => [pid, account])
  }, [poolIdArray, account])

  const pendingRewards = useSingleContractMultipleData(minichefContract, 'pendingReward', userInfoInput ?? [])
  const prevPendingRewards = usePrevious(pendingRewards)

  useEffect(() => {
    const isAllFetched = pendingRewards.every(item => !item.loading)
    const areValuesSame = isEqual(pendingRewards, prevPendingRewards)
    if (isAllFetched && !areValuesSame) {
      const pendingRewardsObj = {} as { [key: string]: {} }
      for (let index = 0; index < pendingRewards.length; index++) {
        const pid = poolIdArray[index]
        const pendingRewardInfo = pendingRewards[index]
        pendingRewardsObj[pid] = {
          pid: pid,
          earnedAmount: pendingRewardInfo?.result?.['pending'].toString()
        }
      }
      dispatch(updateMinichefStakingAllFarmsEarnedAmount({ data: { chainId: chainId, data: pendingRewardsObj } }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingRewards, prevPendingRewards])
}

export const useGetEarnedAmount = (pid: string) => {
  const chainId = useChainId()
  const png = PNG[chainId]

  const amount = useSelector<number>(state => state?.stake?.earnedAmounts?.[chainId]?.[pid]?.earnedAmount)

  return useMemo(
    () => ({
      earnedAmount: new TokenAmount(png, JSBI.BigInt(amount ?? 0))
    }),
    [png, amount]
  )
}

export const sortingOnAvaxStake = (info_a: DoubleSideStakingInfo, info_b: DoubleSideStakingInfo) => {
  // only first has ended
  if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
  // only second has ended
  if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
  // greater stake in avax comes first
  return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
}

export const sortingOnStakedAmount = (info_a: DoubleSideStakingInfo, info_b: DoubleSideStakingInfo) => {
  // only the first is being staked, so we should bring the first up
  if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && !info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return -1
  // only the second is being staked, so we should bring the first down
  if (!info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && info_b.stakedAmount.greaterThan(BIG_INT_ZERO)) return 1
  return 0
}

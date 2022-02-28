import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WAVAX, Pair, Percent } from '@antiyro/sdk'
import { useMemo, useEffect, useState } from 'react'
import {
  PNG,
  USDTe,
  USDCe,
  DAIe,
  MINICHEF_ADDRESS,
  BIG_INT_ZERO,
  BIG_INT_TWO,
  BIG_INT_ONE,
  USDC,
  UST
} from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import {
  NEVER_RELOAD,
  useMultipleContractSingleData,
  useSingleCallResult,
  useSingleContractMultipleData
} from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useTranslation } from 'react-i18next'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from '../../constants/abis/rewarderViaMultiplier'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { getRouterContract } from '../../utils'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import { useStakingContract } from '../../hooks/useContract'
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from './singleSideConfig'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from './doubleSideConfig'
import { ZERO_ADDRESS } from '../../constants'
import { CHAINS } from '../../constants/chains'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useTokens } from '../../hooks/Tokens'
import { useRewardViaMultiplierContract } from '../../hooks/useContract'

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

export interface Migration {
  from: DoubleSideStaking
  to: DoubleSideStaking
}

export interface BridgeMigrator {
  aeb: string
  ab: string
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
  totalStakedInUsd: TokenAmount
  rewardTokensAddress?: Array<string>
  rewardsAddress?: string
  rewardTokensMultiplier?: Array<JSBI>
  getExtraTokensRewardRate?: (rewardRate: TokenAmount, token: Token, tokenMultiplier: JSBI | undefined) => TokenAmount
}

export interface StakingInfo extends DoubleSideStakingInfo {
  swapFeeApr?: number
  stakingApr?: number
  combinedApr?: number
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
    return new TokenAmount(WAVAX[chainId ? chainId : ChainId.AVALANCHE], JSBI.BigInt(0))
  }

  const oneToken = JSBI.BigInt(1000000000000000000)
  const avaxPngRatio = JSBI.divide(JSBI.multiply(oneToken, avaxPngPairReserveOfWavax), avaxPngPairReserveOfPng)
  const valueOfPngInAvax = JSBI.divide(JSBI.multiply(reserveInPng, avaxPngRatio), oneToken)

  return new TokenAmount(
    WAVAX[chainId ? chainId : ChainId.AVALANCHE],
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
      WAVAX[chainId ? chainId : ChainId.AVALANCHE],
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(amountStaked, reserveInWavax),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
        ),
        amountAvailable
      )
    )
  } else {
    return new TokenAmount(WAVAX[chainId ? chainId : ChainId.AVALANCHE], JSBI.BigInt(0))
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

  const png = PNG[chainId || ChainId.AVALANCHE]

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

  const [avaxPngPairState, avaxPngPair] = usePair(WAVAX[chainId || ChainId.AVALANCHE], png)

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
  
  const usdPriceTmp = useUSDCPrice(WAVAX[chainId ? chainId : ChainId.AVALANCHE]);
  const usdPrice = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ?  usdPriceTmp : undefined

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
          ? calculateTotalStakedAmountInAvax(totalSupplyStaked, totalSupplyAvailable, pair.reserveOf(wavax).raw, chainId)
          : calculateTotalStakedAmountInAvaxFromPng(
              totalSupplyStaked,
              totalSupplyAvailable,
              avaxPngPair.reserveOf(png).raw,
              avaxPngPair.reserveOf(WAVAX[tokens[1].chainId]).raw,
              pair.reserveOf(png).raw,
              chainId
            )
        
        const totalStakedInUsd = totalStakedInWavax && (usdPrice?.quote(totalStakedInWavax, chainId) as TokenAmount)
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
          totalStakedInUsd: totalStakedInUsd,
          multiplier: JSBI.BigInt(multiplier ?? 0),
          getHypotheticalRewardRate
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
  const { chainId, library, account } = useActiveWeb3React()

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
        const totalRewardRate = new TokenAmount(
          rewardToken,
          JSBI.BigInt(isPeriodFinished ? 0 : rewardRateState.result?.[0])
        )
        const earnedAmount = new TokenAmount(png, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0))

        const rewardRateInPng = calculateRewardRateInPng(totalRewardRate.raw, valueOfPng)

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
    earnedAmounts,
    stakingTotalSupplies,
    rewardRates,
    periodFinishes,
    amountsOuts,
    info
  ])
}

export function useTotalPngEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const png = PNG[chainId || ChainId.AVALANCHE]
  const stakingInfo0 = useStakingInfo(0)
  const stakingInfo1 = useStakingInfo(1)
  const stakingInfo2 = useMinichefStakingInfos(2)

  const earned0 = useMemo(() => {
    if (!png) new TokenAmount(png, '0')
    return (
      stakingInfo0?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [stakingInfo0, png])

  const earned1 = useMemo(() => {
    if (!png) new TokenAmount(png, '0')
    return (
      stakingInfo1?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [stakingInfo1, png])

  const earned2 = useMemo(() => {
    if (!png) new TokenAmount(png, '0')
    return (
      stakingInfo2?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(png, '0')
      ) ?? new TokenAmount(png, '0')
    )
  }, [stakingInfo2, png])

  return earned0.add(earned1).add(earned2)
  // return earned0 ? (earned1 ? earned0.add(earned1) : earned0) : earned1 ? earned1 : undefined
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
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(chainId ? chainId : ChainId.AVALANCHE, typedValue, stakingToken)

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
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(chainId ? chainId : ChainId.AVALANCHE, typedValue, stakingAmount.token)

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

export function useGetStakingDataWithAPR(version: number) {
  const stakingInfos = useStakingInfo(version)
  const { chainId } = useActiveWeb3React();
  const [stakingInfoData, setStakingInfoData] = useState<StakingInfo[]>(stakingInfos)

  useEffect(() => {
    if (stakingInfos?.length > 0) {
      Promise.all(
        stakingInfos.map(stakingInfo => {
          return fetch(`https://api.pangolin.exchange/pangolin/apr/${stakingInfo.stakingRewardAddress[chainId || ChainId.AVALANCHE]}`)
            .then(res => res.json())
            .then(res => ({
              swapFeeApr: Number(res.swapFeeApr),
              stakingApr: Number(res.stakingApr),
              combinedApr: Number(res.combinedApr),
              ...stakingInfo
            }))
        })
      ).then(updatedStakingInfos => {
        setStakingInfoData(updatedStakingInfos)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length, version])

  return stakingInfoData
}

export function useGetPairDataFromPair(pair: Pair) {
  const { account, chainId } = useActiveWeb3React()

  const dummyToken = new Token(chainId || ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'PNG', 'Pangolin')

  const token0 = pair?.token0 || dummyToken
  const token1 = pair?.token1 || dummyToken

  const usdPriceCurrency0Tmp = useUSDCPrice(token0) 
  const usdPriceCurrency0 = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? usdPriceCurrency0Tmp : undefined
  const usdPriceCurrency1Tmp = useUSDCPrice(token1) 
  const usdPriceCurrency1 = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? usdPriceCurrency1Tmp : undefined

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

  const usdAmountCurrency0: CurrencyAmount = usdPriceCurrency0?.quote(token0Deposited, chainId ? chainId : ChainId.AVALANCHE) ?? zeroTokenAmount0
  const usdAmountCurrency1: CurrencyAmount = usdPriceCurrency1?.quote(token1Deposited, chainId ? chainId : ChainId.AVALANCHE) ?? zeroTokenAmount1

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
  const { chainId } = useActiveWeb3React()
  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId ? chainId : ChainId.AVALANCHE])
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

export const useMinichefStakingInfos = (version = 2, pairToFilterBy?: Pair | null): DoubleSideStakingInfo[] => {
  const { chainId, account } = useActiveWeb3React()
  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId ? chainId : ChainId.AVALANCHE])
  const poolMap = useMinichefPools()
  const png = PNG[chainId || ChainId.AVALANCHE]

  const info = useMemo(
    () =>
      chainId
        ? DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(item =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(item.tokens[0]) && pairToFilterBy.involvesToken(item.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy, version]
  )

  const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const pairs = usePairs(tokens)

  const pairAddresses = useMemo(() => {
    return pairs.map(([state, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')
  const balances = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'balanceOf', [MINICHEF_ADDRESS[chainId ? chainId : ChainId.AVALANCHE]])

  const [avaxPngPairState, avaxPngPair] = usePair(WAVAX[chainId || ChainId.AVALANCHE], png)

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
  const usdPriceTmp = useUSDCPrice(WAVAX[chainId ? chainId : ChainId.AVALANCHE])
  const usdPrice = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? usdPriceTmp : undefined

  const arr = useMemo(() => {
    if (!chainId || !png) return []

    return pairAddresses.reduce<any[]>((memo, pairAddress, index) => {
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

        // get the LP token
        const token0 = pair?.token0
        const token1 = pair?.token1
        const tokens = [token0, token1]
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
        const lpToken = dummyPair.liquidityToken

        const poolAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(poolInfo?.result?.['allocPoint']))
        const totalAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(totalAllocPoint?.[0]))
        const rewardRatePerSecAmount = new TokenAmount(png, JSBI.BigInt(rewardPerSecond?.[0]))
        const poolRewardRate = new TokenAmount(
          png,
          JSBI.divide(JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw), totalAllocPointAmount.raw)
        )

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

        let totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(DAIe[chainId], BIG_INT_ZERO) : undefined
        const totalStakedInWavax = new TokenAmount(WAVAX[chainId], BIG_INT_ZERO)

        if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
          // Default to 0 values above avoiding division by zero errors
        } else if (pair.involvesToken(DAIe[chainId])) {
          const pairValueInDAI = JSBI.multiply(pair.reserveOf(DAIe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInDAI = JSBI.divide(JSBI.multiply(pairValueInDAI, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(DAIe[chainId], stakedValueInDAI) : undefined
        } else if (pair.involvesToken(USDCe[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDCe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(USDCe[chainId], stakedValueInUSDC) : undefined
        } else if (pair.involvesToken(USDC[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDC[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(USDC[chainId], stakedValueInUSDC) : undefined
        } else if (pair.involvesToken(UST[chainId])) {
          const pairValueInUST = JSBI.multiply(pair.reserveOf(UST[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUST = JSBI.divide(JSBI.multiply(pairValueInUST, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(UST[chainId], stakedValueInUST) : undefined
        } else if (pair.involvesToken(USDTe[chainId])) {
          const pairValueInUSDT = JSBI.multiply(pair.reserveOf(USDTe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDT = JSBI.divide(JSBI.multiply(pairValueInUSDT, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? new TokenAmount(USDTe[chainId], stakedValueInUSDT) : undefined
        } else if (isAvaxPool) {
          const totalStakedInWavax = calculateTotalStakedAmountInAvax(
            totalSupplyStaked,
            totalSupplyAvailable,
            pair.reserveOf(WAVAX[chainId]).raw,
            chainId
          )
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? totalStakedInWavax && (usdPrice?.quote(totalStakedInWavax, chainId) as TokenAmount) : undefined
        } else if (isPngPool) {
          const totalStakedInWavax = calculateTotalStakedAmountInAvaxFromPng(
            totalSupplyStaked,
            totalSupplyAvailable,
            avaxPngPair.reserveOf(png).raw,
            avaxPngPair.reserveOf(WAVAX[chainId]).raw,
            pair.reserveOf(png).raw,
            chainId
          )
          totalStakedInUsd = CHAINS[chainId || ChainId].is_mainnet ? totalStakedInWavax && (usdPrice?.quote(totalStakedInWavax, chainId) as TokenAmount) : undefined
        } else {
          // Contains no stablecoin, WAVAX, nor PNG
          console.error(`Could not identify total staked value for pair ${pair.liquidityToken.address}`)
        }

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

        const getExtraTokensRewardRate = (rewardRate: TokenAmount, token: Token, tokenMultiplier: JSBI | undefined) => {
          const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
          const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1) || JSBI.BigInt(1)
          const finalReward = JSBI.divide(JSBI.multiply(rewardMultiplier, rewardRate?.raw), TEN_EIGHTEEN)
          const userRewardRate = new TokenAmount(token, finalReward)
          return userRewardRate
        }

        const userRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)

        memo.push({
          stakingRewardAddress: MINICHEF_ADDRESS,
          tokens,
          earnedAmount,
          rewardRate: userRewardRate,
          totalRewardRate: poolRewardRate,
          stakedAmount,
          totalStakedAmount,
          totalStakedInWavax,
          totalStakedInUsd,
          multiplier: JSBI.divide(multiplier, JSBI.BigInt(100)),
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished,
          getHypotheticalRewardRate,
          getExtraTokensRewardRate,
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
    rewardTokensMultipliers
  ])

  return arr
}

export function useGetPoolDollerWorth(pair: Pair | null) {
  const { account, chainId } = useActiveWeb3React()
  const token0 = pair?.token0
  const currency0 = unwrappedToken(token0 as Token, chainId || ChainId.AVALANCHE)
  const currency0PriceTmp = useUSDCPrice(currency0)
  const currency0Price = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? currency0PriceTmp : undefined
  
  const userPglTmp = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const userPgl = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? userPglTmp : undefined 

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
  
  const liquidityInUSD = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ?
    currency0Price && token0Deposited
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

export function useMinichefPendingRewards(miniChefStaking: DoubleSideStakingInfo | null) {
  const { account } = useActiveWeb3React()

  const rewardAddress = miniChefStaking?.rewardsAddress

  const rewardContract = useRewardViaMultiplierContract(rewardAddress !== ZERO_ADDRESS ? rewardAddress : undefined)

  const earnedAmount = miniChefStaking?.earnedAmount
    ? JSBI.BigInt(miniChefStaking?.earnedAmount?.raw).toString()
    : JSBI.BigInt(0).toString()

  const rewardTokenAmounts = useSingleContractMultipleData(
    rewardContract,
    'pendingTokens',
    account ? [[0, account as string, earnedAmount]] : []
  )
  const rewardTokens = useTokens(miniChefStaking?.rewardTokensAddress)
  const rewardAmounts = rewardTokenAmounts?.[0]?.result?.amounts || []

  const rewardTokensAmount = useMemo(() => {
    if (!rewardTokens) return []
    return rewardTokens.map((rewardToken, index) => new TokenAmount(rewardToken as Token, rewardAmounts[index] || 0))
  }, [rewardAmounts, rewardTokens])

  return useMemo(
    () => ({
      rewardTokensAmount
    }),
    [rewardTokensAmount]
  )
}

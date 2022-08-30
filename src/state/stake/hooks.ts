import { CHAINS, CurrencyAmount, JSBI, Pair, Token, TokenAmount, WAVAX, Percent } from '@pangolindex/sdk'
import { useMemo, useEffect, useState, useCallback } from 'react'
import { BIG_INT_ZERO, BIG_INT_ONE, BIG_INT_SECONDS_IN_WEEK, ZERO_ADDRESS } from '../../constants'
import { PNG } from '../../constants/tokens'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { maxAmountSpend } from 'src/utils'
import { useUSDCPrice } from '../../utils/useUSDCPrice'
import { getRouterContract } from '../../utils'
import { usePngContract, useStakingContract } from '../../hooks/useContract'
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from './singleSideConfig'
import { wrappedCurrencyAmount } from 'src/utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { PairState, usePair, usePairs } from 'src/data/Reserves'
import { useChainId } from 'src/hooks'
import {
  useLibrary,
  useTranslation,
  useMinichefStakingInfos,
  StakingInfo,
  DoubleSideStakingInfo,
  fetchChunkedAprs,
  useDerivedStakeInfo,
  calculateTotalStakedAmountInAvax,
  calculateTotalStakedAmountInAvaxFromPng,
  useTotalSupply,
  useTokenBalance
} from '@pangolindex/components'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from './doubleSideConfig'
import ERC20_INTERFACE from 'src/constants/abis/erc20'

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
        (accumulator: StakingInfo, stakingInfo: StakingInfo) => accumulator.add(stakingInfo.earnedAmount),
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
        const pids = stakingInfos.map((stakingInfo: DoubleSideStakingInfo) => stakingInfo.stakingRewardAddress)
        aprRequest = fetchChunkedAprs(pids, chainId)
      }

      aprRequest
        .then(aprResponses =>
          stakingInfos.map((stakingInfo: DoubleSideStakingInfo, i: number) => ({
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
      ? pair.getLiquidityValues(totalPoolTokens, userPoolBalance, { feeOn: false })
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
        const _tokens = info[index].tokens as Token[]
        const wavax = _tokens[0].equals(WAVAX[_tokens[0].chainId]) ? _tokens[0] : _tokens[1]
        const dummyPair = new Pair(new TokenAmount(_tokens[0], '0'), new TokenAmount(_tokens[1], '0'), chainId)
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

        const isAvaxPool = _tokens[0].equals(WAVAX[_tokens[0].chainId])
        const totalStakedInWavax = isAvaxPool
          ? calculateTotalStakedAmountInAvax(
              totalSupplyStaked,
              totalSupplyAvailable,
              pair.reserveOfToken(wavax).raw,
              chainId
            )
          : calculateTotalStakedAmountInAvaxFromPng(
              totalSupplyStaked,
              totalSupplyAvailable,
              avaxPngPair.reserveOfToken(png).raw,
              avaxPngPair.reserveOfToken(WAVAX[_tokens[1].chainId]).raw,
              pair.reserveOfToken(png).raw,
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
          tokens: _tokens,
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

/* eslint-disable @typescript-eslint/no-unused-vars */
export const useDummyStakingInfo = (_version: number, _pairToFilterBy?: Pair | null) => {
  return [] as DoubleSideStakingInfo[]
}

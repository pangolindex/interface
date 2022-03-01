import React, { useMemo } from 'react'
import { useMinichefStakingInfos } from '../../state/stake/hooks'
import { RouteComponentProps } from 'react-router-dom'
import Manage from './Manage'
import { usePair } from '../../data/Reserves'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useCurrency, useTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useRewardViaMultiplierContract } from '../../hooks/useContract'
import { JSBI, Token, TokenAmount } from '@antiyro/sdk'

const ManageV2: React.FC<RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>> = ({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}) => {
  const { chainId, account } = useActiveWeb3React()

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const miniChefStaking = useMinichefStakingInfos(2, stakingTokenPair)?.[0]

  const rewardAddress = miniChefStaking?.rewardsAddress
  const rewardContract = useRewardViaMultiplierContract(rewardAddress)

  const earnedAmount = miniChefStaking?.earnedAmount
    ? JSBI.BigInt(miniChefStaking?.earnedAmount?.raw).toString()
    : JSBI.BigInt(0).toString()

  const rewardTokenAmounts = useSingleContractMultipleData(
    rewardContract,
    'pendingTokens',
    account ? [[0, account as string, earnedAmount]] : []
  )
  const rewardTokens = useTokens(miniChefStaking?.rewardTokensAddress)
  const rewardAmounts = rewardTokenAmounts?.[0]?.result?.amounts || [] // eslint-disable-line react-hooks/exhaustive-deps

  const rewardTokensAmount = useMemo(() => {
    if (!rewardTokens) return []
    return rewardTokens.map((rewardToken, index) => new TokenAmount(rewardToken as Token, rewardAmounts[index] || 0))
  }, [rewardAmounts, rewardTokens])

  return (
    <Manage
      version="2"
      stakingInfo={miniChefStaking}
      currencyA={currencyA}
      currencyB={currencyB}
      extraRewardTokensAmount={rewardTokensAmount}
    />
  )
}

export default ManageV2

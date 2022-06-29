import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, useState, useEffect } from 'react'
import { ChainId, Token, TokenAmount } from '@pangolindex/sdk'
import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { PNG } from '../constants/tokens'
import { nearFn } from '@pangolindex/components'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  // Special case to handle PNG's proxy burnt total supply
  if (token?.equals(PNG[ChainId.AVALANCHE])) {
    return new TokenAmount(token, '230000000000000000000000000')
  }

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export function useNearTotalSupply(token?: Token): TokenAmount | undefined {
  const [totalSupply, setTotalSupply] = useState<TokenAmount>()

  useEffect(() => {
    async function checkTokenBalance() {
      if (token) {
        const balance = await nearFn.getTotalSupply(token?.address)
        const nearBalance = new TokenAmount(token, balance)

        setTotalSupply(nearBalance)
      }
    }

    checkTokenBalance()
  }, [token])

  return useMemo(() => totalSupply, [totalSupply])
}

export const useTotalSupplyHook = {
  [ChainId.FUJI]: useTotalSupply,
  [ChainId.AVALANCHE]: useTotalSupply,
  [ChainId.WAGMI]: useTotalSupply,
  [ChainId.COSTON]: useTotalSupply,
  [ChainId.NEAR_MAINNET]: useNearTotalSupply,
  [ChainId.NEAR_TESTNET]: useNearTotalSupply
}

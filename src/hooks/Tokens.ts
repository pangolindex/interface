import { useMemo } from 'react'
import { Token } from '@pangolindex/sdk'
import { useSelectedTokenList } from '../state/lists/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { useChain, useChainId } from './index'
import { useQuery } from 'react-query'
import { COINGECKO_API } from 'src/constants'
import axios, { AxiosResponse } from 'axios'

export function useAllTokens(): { [address: string]: Token } {
  const chainId = useChainId()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

export interface CoingeckoData {
  coinId: string
  homePage: string
  description: string
}

/**
 * Get the coingecko data for a token
 * @param coin - Token or Currency
 * @returns CoingeckoData of token if exist in coingecko else null
 * */

export function useCoinGeckoTokenData(coin: Token) {
  const chain = useChain(coin.chainId)

  return useQuery(['coingeckoToken', coin.address, chain.name], async () => {
    if (!chain.coingecko_id || !chain.evm) {
      return null
    }
    let response: AxiosResponse | null = null
    try {
      response = await axios.get(
        `${COINGECKO_API}/coins/${chain.coingecko_id}/contract/${coin.address.toLowerCase()}`,
        {
          timeout: 60000
        }
      )
    } catch (error) {
      console.error(error)
    }

    if (!response || response.status !== 200) {
      return null
    }

    const data = response.data
    if (!data?.id) {
      return null
    }

    return {
      coinId: data?.id,
      homePage: data?.links?.homepage[0],
      description: data?.description?.en
    } as CoingeckoData
  })
}

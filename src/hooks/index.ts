import { ChainId, ALL_CHAINS, CHAINS, TokenAmount } from '@pangolindex/sdk'
import { PANGOLIN_API_BASE_URL, Tokens, useActiveWeb3React } from '@honeycomb-finance/shared'
import { useQuery } from 'react-query'
import axios from 'axios'

export function useChainId() {
  const { chainId } = useActiveWeb3React()
  return (chainId || ChainId.AVALANCHE) as ChainId
}

export const useChain = (chainId: number) => {
  return ALL_CHAINS.filter(chain => chain.chain_id === chainId)[0]
}

export const usePngSymbol = () => {
  const chainId = useChainId()
  return CHAINS[chainId || ChainId.AVALANCHE].png_symbol!
}

export function usePNGCirculationSupply() {
  const chainId = useChainId()
  const { PNG } = Tokens
  const png = PNG[chainId]

  return useQuery(
    ['png-circulation-supply', png.chainId, png.address],
    async () => {
      if (!png) return undefined

      try {
        const response = await axios.get(`${PANGOLIN_API_BASE_URL}/v2/${chainId}/png/circulating-supply`, {
          timeout: 3 * 1000 // 3 seconds
        })

        const data = response.data
        return new TokenAmount(png, data)
      } catch (error) {
        return undefined
      }
    },
    {
      cacheTime: 60 * 5 * 1000 // 5 minutes
    }
  )
}

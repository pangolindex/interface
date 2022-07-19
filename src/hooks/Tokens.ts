import { useMemo } from 'react'
import { parseBytes32String } from '@ethersproject/strings'
import { Token } from '@pangolindex/sdk'
import ERC20_INTERFACE, { ERC20_BYTES32_INTERFACE } from '../constants/abis/erc20'
import { useSelectedTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import { useChain, useChainId } from './index'
import { useQuery } from 'react-query'
import { COINGECKO_API } from 'src/constants'
import axios, { AxiosError } from 'axios'

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

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

export function useTokens(tokensAddress: string[] = []): Array<Token | undefined | null> | undefined | null {
  const chainId = useChainId()
  const tokens = useAllTokens()

  const tokensName = useMultipleContractSingleData(tokensAddress, ERC20_INTERFACE, 'name', undefined, NEVER_RELOAD)
  const tokensNameBytes32 = useMultipleContractSingleData(
    tokensAddress,
    ERC20_BYTES32_INTERFACE,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbols = useMultipleContractSingleData(tokensAddress, ERC20_INTERFACE, 'symbol', undefined, NEVER_RELOAD)
  const symbolsBytes32 = useMultipleContractSingleData(
    tokensAddress,
    ERC20_BYTES32_INTERFACE,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimals = useMultipleContractSingleData(tokensAddress, ERC20_INTERFACE, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (!tokensAddress || tokensAddress?.length === 0) return []
    if (!chainId) return []

    return tokensAddress.reduce<Token[]>((acc, tokenAddress, index) => {
      const tokenName = tokensName?.[index]
      const tokenNameBytes32 = tokensNameBytes32?.[index]
      const symbol = symbols?.[index]
      const symbolBytes32 = symbolsBytes32?.[index]
      const decimal = decimals?.[index]
      const address = isAddress(tokenAddress)

      if (!!address && tokens[address]) {
        // if we have user tokens already
        acc.push(tokens[address])
      } else if (
        tokenName?.loading === false &&
        tokenNameBytes32?.loading === false &&
        symbol?.loading === false &&
        symbolBytes32?.loading === false &&
        decimal?.loading === false &&
        address
      ) {
        const token = new Token(
          chainId,
          tokenAddress,
          decimal?.result?.[0],
          parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
          parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
        )

        acc.push(token)
      }

      return acc
    }, [])
  }, [chainId, decimals, symbols, symbolsBytes32, tokensName, tokensNameBytes32, tokens, tokensAddress])
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
    const response = await axios
      .get(`${COINGECKO_API}/coins/${chain.coingecko_id}/contract/${coin.address.toLowerCase()}`, {
        timeout: 1000
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          return error.response
        }
        return null
      })

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

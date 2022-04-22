import { useMemo, useEffect, useState } from 'react'
import { parseBytes32String } from '@ethersproject/strings'
import { Currency, CAVAX, Token, currencyEquals, CHAINS } from '@pangolindex/sdk'
import ERC20_INTERFACE, { ERC20_BYTES32_INTERFACE } from '../constants/abis/erc20'
import { useSelectedTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import { useChainId } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'

import { ChainsId } from 'src/constants/chains'

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

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
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

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const chainId = useChainId()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
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

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const chainId = useChainId()
  const isAVAX = currencyId?.toUpperCase() === 'AVAX'
  const token = useToken(isAVAX ? undefined : currencyId)
  return isAVAX ? chainId && CAVAX[chainId] : token
}

export function useCoinGeckoTokenData(coin: Token) {
  const [result, setResult] = useState({} as { coinId: string; homePage: string; description: string })

  useEffect(() => {
    const getCoinData = async () => {
      const chain = coin.chainId === 43113 ? CHAINS[ChainsId.AVAX] : CHAINS[coin.chainId]

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${chain.coingecko_id}/contract/${coin.address.toLowerCase()}`
      )
      const data = await response.json()

      setResult({
        coinId: data?.id,
        homePage: data?.links?.homepage[0],
        description: data?.description?.en
      })
    }
    getCoinData()
  }, [coin])

  return result
}

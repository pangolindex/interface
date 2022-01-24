import { useMemo, useEffect, useState } from 'react'
import { parseBytes32String } from '@ethersproject/strings'
import { Currency, CAVAX, Token, currencyEquals } from '@pangolindex/sdk'
import { useSelectedTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { COIN_ID_OVERRIDE } from 'src/constants'
import CoinGecko from 'coingecko-api'

const CoinGeckoClient = new CoinGecko()

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
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
  const { chainId } = useActiveWeb3React()
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

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isAVAX = currencyId?.toUpperCase() === 'AVAX'
  const token = useToken(isAVAX ? undefined : currencyId)
  return isAVAX ? CAVAX : token
}

export const useCoinGeckoAllCoins = () => {
  const [coins, setCoins] = useState([] as any[])

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/list`)
      .then(res => res.json())
      .then(val => setCoins(val))
  }, [])

  return coins
}

export function useCoinGeckoTokenData(symbol?: string, name?: string) {
  const [result, setResult] = useState({} as { coinId: string; homePage: string; description: string })
  const allCoins = useCoinGeckoAllCoins()

  useEffect(() => {
    let data = {} as { coinId: string; homePage: string; description: string }

    let getCoinData = async () => {
      try {
        let newSymbol = (symbol || '')?.split('.')[0]
        const isWrappedToken = (name || '')?.split(' ')[0].toLowerCase() === 'wrapped'
        if (isWrappedToken) {
          if (newSymbol?.charAt(0)?.toLocaleLowerCase() === 'w') {
            newSymbol = newSymbol?.substring(1)
          }
        }
        newSymbol = newSymbol?.toUpperCase()

        const coinId =
          newSymbol in COIN_ID_OVERRIDE // here we are checking existance of key instead of value of key, because value of key might be undefined
            ? undefined
            : allCoins.find((data: any) => data?.symbol?.toUpperCase() === newSymbol)?.id

        if (!!coinId) {
          let coin = (await CoinGeckoClient.coins.fetch(coinId, {
            tickers: false,
            community_data: false,
            developer_data: false,
            localization: false,
            sparkline: false
          })) as any

          data.coinId = coinId
          data.homePage = coin?.data?.links?.homepage?.[0]
          data.description = coin?.data?.description?.en
        }

        setResult(data)
      } catch (e) {
        console.log(e)
      }
    }
    if (symbol && name) {
      getCoinData()
    }
  }, [symbol, name, allCoins])

  return result
}

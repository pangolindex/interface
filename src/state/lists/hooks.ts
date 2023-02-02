import { ChainId, Token } from '@pangolindex/sdk'
import { Tags, TokenInfo, TokenList } from '@pangolindex/token-lists'
import { useMemo } from 'react'
import { AppState, useSelector } from '../index'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }> }>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.FUJI]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.WAGMI]: {},
  [ChainId.COSTON]: {},
  [ChainId.SONGBIRD]: {},
  [ChainId.FLARE_MAINNET]: {},
  [ChainId.HEDERA_TESTNET]: {},
  [ChainId.HEDERA_MAINNET]: {},
  [ChainId.NEAR_MAINNET]: {},
  [ChainId.NEAR_TESTNET]: {},
  [ChainId.COSTON2]: {},
  [ChainId.EVMOS_TESTNET]: {},
  [ChainId.EVMOS_MAINNET]: {},
  [ChainId.ETHEREUM]: {},
  [ChainId.POLYGON]: {},
  [ChainId.FANTOM]: {},
  [ChainId.XDAI]: {},
  [ChainId.BSC]: {},
  [ChainId.ARBITRUM]: {},
  [ChainId.CELO]: {},
  [ChainId.OKXCHAIN]: {},
  [ChainId.VELAS]: {},
  [ChainId.AURORA]: {},
  [ChainId.CRONOS]: {},
  [ChainId.FUSE]: {},
  [ChainId.MOONRIVER]: {},
  [ChainId.MOONBEAM]: {},
  [ChainId.OP]: {}
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)

  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map(tagId => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap?.[token.chainId]?.[token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

export function useTokenList(urls: string[] | undefined): TokenAddressMap {
  const lists = useSelector<AppState['lists']['byUrl']>(state => state.lists.byUrl)

  const tokenList = {} as { [chainId: string]: { [tokenAddress: string]: WrappedTokenInfo } }
  return useMemo(() => {
    ;([] as string[]).concat(urls || []).forEach(url => {
      const current = lists[url]?.current
      if (url && current) {
        try {
          const data = listToTokenMap(current)
          for (const [chainId, tokens] of Object.entries(data)) {
            tokenList[chainId] = tokenList[chainId] || {}
            tokenList[chainId] = {
              ...tokenList[chainId],
              ...tokens
            }
          }
        } catch (error) {
          console.error('Could not show token list due to error', error)
        }
      }
    })
    return tokenList as TokenAddressMap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, urls])
}

export function useSelectedListUrl(): string[] | undefined {
  return useSelector<AppState['lists']['selectedListUrl']>(state =>
    ([] as string[]).concat(state?.lists?.selectedListUrl || [])
  )
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListUrl())
}

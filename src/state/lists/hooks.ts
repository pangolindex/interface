import { ChainId, Token } from '@pangolindex/sdk'
import { Tags, TokenInfo, TokenList } from '@pangolindex/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { AEB_TOKENLIST } from '../../constants/lists'
import { WAVAX } from '@pangolindex/sdk'
import { PNG } from '../../constants'

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
  [ChainId.WAGMI]: {}
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
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
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
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

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
  return useSelector<AppState, AppState['lists']['selectedListUrl']>(state =>
    ([] as string[]).concat(state?.lists?.selectedListUrl || [])
  )
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListUrl())
}

export function useSelectedListInfo(): {
  current: TokenList | null
  pending: TokenList | null
  loading: boolean
  multipleSelected: boolean
  selectedCount: number
} {
  const selectedListUrl = useSelectedListUrl()
  const firstSelectedUrl = (selectedListUrl || [])?.[0]
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const list = firstSelectedUrl ? listsByUrl[firstSelectedUrl] : undefined
  return {
    current: list?.current ?? null,
    pending: list?.pendingUpdate ?? null,
    loading: list?.loadingRequestId !== null,
    multipleSelected: (selectedListUrl || [])?.length > 1,
    selectedCount: (selectedListUrl || [])?.length
  }
}

// returns all downloaded current lists
export function useAllLists(): TokenList[] {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  return useMemo(
    () =>
      Object.keys(lists)
        .map(url => lists[url].current)
        .filter((l): l is TokenList => Boolean(l)),
    [lists]
  )
}

export function useIsSelectedAEBTokenList(): boolean {
  const selectedListUrl = useSelectedListUrl()
  const isSelected = (selectedListUrl || []).includes(AEB_TOKENLIST)
  return isSelected
}

export function useIsSelectedAEBToken(): boolean {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  const allAEBTokens = listsByUrl[AEB_TOKENLIST]?.current?.tokens || []

  const selectedOutputToken = useSelector<AppState, AppState['swap']['OUTPUT']>(state => state.swap.OUTPUT)

  const aebToken = allAEBTokens.find(token => token?.address === selectedOutputToken?.currencyId)

  // ignore PNG and WAVAX token
  if (aebToken?.address === PNG[ChainId.AVALANCHE].address || aebToken?.address === WAVAX[ChainId.AVALANCHE].address) {
    return false
  }

  return !!aebToken
}

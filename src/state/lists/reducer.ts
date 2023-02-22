import { createReducer } from '@reduxjs/toolkit'
import { getVersionUpgrade, VersionUpgrade } from '@pangolindex/token-lists'
import { TokenList } from '@pangolindex/token-lists/dist/types'
import { DEFAULT_TOKEN_LISTS, DEFAULT_TOKEN_LISTS_SELECTED } from '@pangolindex/components'
import { updateVersion } from '../global/actions'
import { acceptListUpdate, addList, fetchTokenList, removeList, selectList } from './actions'

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly pendingUpdate: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[]
  readonly selectedListUrl: string[] | undefined
}

type ListState = ListsState['byUrl'][string]

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_TOKEN_LISTS,
  byUrl: {
    ...DEFAULT_TOKEN_LISTS.reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE
      return memo
    }, {})
  },
  selectedListUrl: DEFAULT_TOKEN_LISTS_SELECTED
}

export default createReducer(initialState, builder =>
  builder
    .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
      state.byUrl[url] = {
        ...state.byUrl[url],
        current: null,
        pendingUpdate: null,
        loadingRequestId: requestId,
        error: null
      }
    })
    .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
      const current = state.byUrl[url]?.current
      const loadingRequestId = state.byUrl[url]?.loadingRequestId

      // no-op if update does nothing
      if (current) {
        const upgradeType = getVersionUpgrade(current.version, tokenList.version)
        if (upgradeType === VersionUpgrade.NONE) return
        if (loadingRequestId === null || loadingRequestId === requestId) {
          state.byUrl[url] = {
            ...state.byUrl[url],
            loadingRequestId: null,
            error: null,
            current: current,
            pendingUpdate: tokenList
          }
        }
      } else {
        state.byUrl[url] = {
          ...state.byUrl[url],
          loadingRequestId: null,
          error: null,
          current: tokenList,
          pendingUpdate: null
        }
      }
    })
    .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
      if (state.byUrl[url]?.loadingRequestId !== requestId) {
        // no-op since it's not the latest request
        return
      }

      state.byUrl[url] = {
        ...state.byUrl[url],
        loadingRequestId: null,
        error: errorMessage,
        current: null,
        pendingUpdate: null
      }
    })
    .addCase(selectList, (state, { payload: { url, shouldSelect } }) => {
      const existingSelectedListUrl = ([] as string[]).concat(state.selectedListUrl || [])
      if (shouldSelect) {
        // if user want to select the list, then just push it into selected array
        existingSelectedListUrl.push(url)
        state.selectedListUrl = existingSelectedListUrl
      } else {
        const index = existingSelectedListUrl.indexOf(url)

        if (index !== -1) {
          if (existingSelectedListUrl?.length === 1) {
            // if user want to deselect the list and if there is only one item in the list
            state.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED
          } else {
            existingSelectedListUrl.splice(index, 1)
            state.selectedListUrl = existingSelectedListUrl
          }
        }
      }

      // automatically adds list
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE
      }
    })
    .addCase(addList, (state, { payload: url }) => {
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE
      }
    })
    .addCase(removeList, (state, { payload: url }) => {
      if (state.byUrl[url]) {
        delete state.byUrl[url]
      }

      const existingList = ([] as string[]).concat(state.selectedListUrl || [])
      const index = existingList.indexOf(url)

      if (index !== -1) {
        if (existingList?.length === 1) {
          // if user want to remove the list and if there is only one item in the selected list
          state.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED
        } else {
          existingList.splice(index, 1)
          state.selectedListUrl = existingList
        }
      }
    })
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update')
      }
      state.byUrl[url] = {
        ...state.byUrl[url],
        pendingUpdate: null,
        current: state.byUrl[url].pendingUpdate
      }
    })
    .addCase(updateVersion, state => {
      // state loaded from localStorage, but new lists have never been initialized
      if (!state.lastInitializedDefaultListOfLists) {
        state.byUrl = initialState.byUrl
        state.selectedListUrl = initialState.selectedListUrl
      } else if (state.lastInitializedDefaultListOfLists) {
        // Safeguard for legacy data maintained before multiple lists could be selected
        if (typeof state.selectedListUrl === 'string') state.selectedListUrl = [state.selectedListUrl]

        const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
          (s, l) => s.add(l),
          new Set()
        )
        const newListOfListsSet = DEFAULT_TOKEN_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())

        // Detected addition of default token lists
        DEFAULT_TOKEN_LISTS.forEach(listUrl => {
          if (!lastInitializedSet.has(listUrl)) {
            state.byUrl[listUrl] = NEW_LIST_STATE
            if (DEFAULT_TOKEN_LISTS_SELECTED.includes(listUrl)) {
              if (!state.selectedListUrl || !state.selectedListUrl.includes(listUrl)) {
                state.selectedListUrl = (state.selectedListUrl || []).concat([listUrl])
              }
            }
          }
        })

        // Detected removal of default token lists
        state.lastInitializedDefaultListOfLists.forEach(listUrl => {
          if (!newListOfListsSet.has(listUrl)) {
            delete state.byUrl[listUrl]
            if (!!state.selectedListUrl && state.selectedListUrl.includes(listUrl)) {
              state.selectedListUrl = state.selectedListUrl.filter(url => url !== listUrl)
              if (state.selectedListUrl.length === 0) {
                state.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED
              }
            }
          }
        })
      }

      state.lastInitializedDefaultListOfLists = DEFAULT_TOKEN_LISTS

      if (!state.selectedListUrl) {
        state.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED
        DEFAULT_TOKEN_LISTS.forEach(listUrl => {
          if (!state.byUrl[listUrl]) {
            state.byUrl[listUrl] = NEW_LIST_STATE
          }
        })
      }
    })
)

import { ChainId, Token } from '@pangolindex/sdk'
import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppState, useDispatch, useSelector } from '../index'
import { SerializedToken, updateUserDarkMode, toggleURLWarning, updateWallet } from './actions'

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<{ userDarkMode: boolean | null; matchesDarkMode: boolean }>(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode
    }),
    shallowEqual
  )

  if (userDarkMode === null && !matchesDarkMode) {
    // by default we want to show dark mode
    return true
  }

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useURLWarningVisible(): boolean {
  return useSelector((state: AppState) => state.user.URLWarningVisible)
}

export function useURLWarningToggle(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch])
}

export function useWallet(): [string | null, (wallet: string | null) => void] {
  const dispatch = useDispatch()
  const wallet = useSelector<AppState['user']['wallet']>(state => state.user.wallet)

  const setWallet = useCallback(
    (wallet: string | null) => {
      dispatch(updateWallet({ wallet }))
    },
    [dispatch]
  )

  return [wallet, setWallet]
}

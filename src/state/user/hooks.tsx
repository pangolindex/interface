import { useCallback } from 'react'
import { shallowEqual } from 'react-redux'
import { AppState, useDispatch, useSelector } from '../index'
import { updateUserDarkMode, toggleURLWarning, updateWallet } from './actions'

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
    (walletKey: string | null) => {
      dispatch(updateWallet({ wallet: walletKey }))
    },
    [dispatch]
  )

  return [wallet, setWallet]
}

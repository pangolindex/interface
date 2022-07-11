import { useEffect } from 'react'
import { useDispatch } from 'src/state'
import { updateMatchesDarkMode } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch()

  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (_match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: _match.matches }))
    }

    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    return () => {
      if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])

  return null
}

import { useEffect, useState } from 'react'

export const useLocationHash = () => {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', onHashChange, false)
    return () => {
      window.removeEventListener('hashchange', onHashChange, false)
    }
  }, [])

  return hash
}

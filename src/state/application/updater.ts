import { useCallback, useEffect, useState } from 'react'
import { useChainId } from 'src/hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import { useLibrary } from '@pangolindex/components'

export default function Updater(): null {
  const chainId = useChainId()
  const { library, provider } = useLibrary()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(_state => {
        if (chainId === _state.chainId) {
          if (typeof _state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, _state.blockNumber) }
        }
        return _state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })
    ;(provider as any)
      ?.getBlockNumber()
      .then(blockNumberCallback)
      .catch((error: any) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on && library.on('block', blockNumberCallback)
    return () => {
      library.removeListener && library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible, provider])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}

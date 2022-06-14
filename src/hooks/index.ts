import { Web3Provider } from '@ethersproject/providers'
import { ChainId, ALL_CHAINS } from '@pangolindex/sdk'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { gnosisSafe, injected, xDefi, near, IS_IN_IFRAME, NetworkContextName } from '@pangolindex/components'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

const getExistingConnector = async () => {
  const isMetaMask = await injected.isAuthorized()

  const isNear = await near.isAuthorized()

  if (isMetaMask) {
    return injected
  }
  return isNear ? near : xDefi
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const [triedSafe, setTriedSafe] = useState<boolean>(!IS_IN_IFRAME)

  useEffect(() => {
    const eagerConnect = async () => {
      if (!triedSafe) {
        gnosisSafe.isSafeApp().then(loadedInSafe => {
          if (loadedInSafe) {
            activate(gnosisSafe, undefined, true).catch(() => {
              setTriedSafe(true)
            })
          } else {
            setTriedSafe(true)
          }
        })
      } else {
        const existingConnector = await getExistingConnector()

        existingConnector.isAuthorized().then(isAuthorized => {
          if (isAuthorized) {
            activate(existingConnector, undefined, true).catch(() => {
              setTried(true)
            })
          } else {
            if (isMobile) {
              if (window.ethereum) {
                activate(injected, undefined, true).catch(() => {
                  setTried(true)
                })
              } else if (window.xfi && window.xfi.ethereum) {
                activate(xDefi, undefined, true).catch(() => {
                  setTried(true)
                })
              } else {
                setTried(true)
              }
            } else {
              setTried(true)
            }
          }
        })
      }
    }

    eagerConnect()
  }, [activate, triedSafe, setTriedSafe]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(_error => {
          console.error('Failed to activate after chain changed', _error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(_error => {
            console.error('Failed to activate after accounts changed', _error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}

export const useChainId = () => {
  const { chainId } = useActiveWeb3React()
  return chainId || ChainId.AVALANCHE
}

export const useChain = (chainId: number) => {
  return ALL_CHAINS.filter(chain => chain.chain_id === chainId)[0]
}

import { Web3Provider } from '@ethersproject/providers'
import { ChainId, ALL_CHAINS, CHAINS, AVALANCHE_MAINNET } from '@pangolindex/sdk'
import { UnsupportedChainIdError, useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  gnosisSafe,
  injected,
  xDefi,
  // near,
  IS_IN_IFRAME,
  NetworkContextName,
  SUPPORTED_WALLETS,
  bitKeep
} from '@pangolindex/components'
import { useWallet } from 'src/state/user/hooks'
import { AbstractConnector } from '@web3-react/abstract-connector'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

type Connector = AbstractConnector & { isAuthorized?: () => Promise<boolean> }

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const [triedSafe, setTriedSafe] = useState<boolean>(!IS_IN_IFRAME)
  const [wallet, setWallet] = useWallet()

  // either previously used connector, or window.ethereum if exists (important for mobile)
  const connector: Connector | null = useMemo(() => (wallet ? SUPPORTED_WALLETS[wallet]?.connector : window.ethereum), [
    wallet
  ])

  const activateMobile = useCallback(async () => {
    if (window.ethereum) {
      try {
        await activate(injected, undefined, true)
        setTried(true)
      } catch (error) {
        if (error instanceof UnsupportedChainIdError) {
          try {
            await window?.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${AVALANCHE_MAINNET?.chain_id?.toString(16)}` }]
            })
            setTried(true)
          } catch (error) {
            try {
              await window?.ethereum?.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: AVALANCHE_MAINNET.name,
                    chainId: `0x${AVALANCHE_MAINNET?.chain_id?.toString(16)}`,
                    rpcUrls: [AVALANCHE_MAINNET.rpc_uri],
                    blockExplorerUrls: AVALANCHE_MAINNET.blockExplorerUrls,
                    iconUrls: AVALANCHE_MAINNET.logo,
                    nativeCurrency: AVALANCHE_MAINNET.nativeCurrency
                  }
                ]
              })
            } catch (error) {
              setWallet(null)
              setTried(true)
            }
          }
        } else {
          setWallet(null)
          setTried(true)
        }
      }
    } else {
      setWallet(null)
      setTried(true)
    }
  }, [activate, setWallet])

  useEffect(() => {
    const eagerConnect = async () => {
      if (!triedSafe && connector === gnosisSafe) {
        gnosisSafe.isSafeApp().then(loadedInSafe => {
          if (loadedInSafe) {
            activate(gnosisSafe, undefined, true).catch(() => {
              setTriedSafe(true)
            })
          } else {
            setTriedSafe(true)
          }
        })
      } else if (connector?.isAuthorized) {
        connector.isAuthorized?.().then(isAuthorized => {
          if (isAuthorized) {
            activate(connector, undefined, true).catch(() => {
              setWallet(null)
              setTried(true)
            })
          } else {
            setWallet(null)
            setTried(true)
          }
        })
      } else if (window.xfi && window.xfi.ethereum) {
        try {
          await activate(xDefi, undefined, true)
          setTried(true)
        } catch (error) {
          setWallet(null)
          setTried(true)
        }
      } else if (!!window.bitkeep.ethereum && window.isBitKeep) {
        try {
          await activate(bitKeep, undefined, true)
          setTried(true)
        } catch (error) {
          setWallet(null)
          setTried(true)
        }
      } else {
        setWallet(null)
        setTried(true)
      }
    }

    if (isMobile) {
      activateMobile()
    } else {
      eagerConnect()
    }
  }, [activate, activateMobile, triedSafe, setTriedSafe, connector, setWallet, tried]) // intentionally only running on mount (make sure it's only mounted once :))

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

export const usePngSymbol = () => {
  const { chainId } = useActiveWeb3React()
  return CHAINS[chainId || ChainId.AVALANCHE].png_symbol!
}

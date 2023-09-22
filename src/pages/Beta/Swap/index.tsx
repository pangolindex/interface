import React from 'react'
import SwapUI from './SwapUI'
import { useLibrary, useActiveWeb3React } from '@honeycomb-finance/shared'
import { useChainId } from 'src/hooks'
import { GelatoProvider, galetoStore } from '@honeycomb-finance/swap'
import { Web3Provider } from '@ethersproject/providers'
import { Provider } from 'react-redux'

const Swap = () => {
  const chainId = useChainId()
  const { account } = useActiveWeb3React()
  const { library } = useLibrary()

  const ethersLibrary = library && !library?._isProvider ? new Web3Provider(library) : library
  return (
    <Provider store={galetoStore}>
      <GelatoProvider
        library={ethersLibrary}
        chainId={chainId}
        account={account ?? undefined}
        useDefaultTheme={false}
        handler={'pangolin'}
      >
        <SwapUI />
      </GelatoProvider>
    </Provider>
  )
}
export default Swap

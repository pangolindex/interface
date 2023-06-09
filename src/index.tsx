import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode, useContext } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NetworkContextName, PangolinProvider, useLibrary } from '@pangolindex/components'
import App from './pages/App'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import store, { InterfaceContext } from './state'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React, useChainId } from './hooks'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const mixpanelToken = import.meta.env.VITE_MIXPANEL
const hasuraApiKey = import.meta.env.VITE_HASURAKEY

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000 * 60,
      refetchOnWindowFocus: false
    }
  }
})

function Updaters() {
  return (
    <>
      <UserUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const ComponentThemeProvider = () => {
  const chainId = useChainId()
  const theme = useContext(ThemeContext)

  const { account } = useActiveWeb3React()

  const { library } = useLibrary()

  return (
    <PangolinProvider
      library={library}
      chainId={chainId}
      account={account ?? undefined}
      theme={theme as any}
      config={{
        mixpanelToken,
        hasuraApiKey
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Updaters />
        <FixedGlobalStyle />
        <ThemedGlobalStyle />
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </PangolinProvider>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store} context={InterfaceContext}>
          <ThemeProvider>
            <ComponentThemeProvider />
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)

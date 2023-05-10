import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode, useContext } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PangolinProvider } from '@pangolindex/components'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import App from './pages/App'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import store, { InterfaceContext } from './state'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { ThemeContext } from 'styled-components'
import Package from '../package.json'
import { Web3Provider } from '@ethersproject/providers'

try {
  Sentry.init({
    dsn: 'https://ff9ffce9712f415f8ad4c2a80123c984@o1080468.ingest.sentry.io/6086371',
    integrations: [new Integrations.BrowserTracing()],
    release: `pangolin-interface@${Package.version}`, //manual for now
    tracesSampleRate: 0.4,
    allowUrls: ['https://app.pangolin.exchange', 'https://dev.pangolin.exchange'],
    enabled: import.meta.env.PROD,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Blocked a frame with origin "https://app.pangolin.exchange" from accessing a cross-origin frame.'
    ]
  })
} catch (error) {
  console.log(error)
}

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const mixpanelToken = import.meta.env.VITE_MIXPANEL

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
  const theme = useContext(ThemeContext)

  const { library, account, chainId } = useWeb3React<Web3Provider>()
  return (
    <PangolinProvider
      library={library}
      chainId={chainId}
      account={account ?? undefined}
      theme={theme as any}
      mixpanelToken={mixpanelToken}
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
      <Provider store={store} context={InterfaceContext}>
        <ThemeProvider>
          <ComponentThemeProvider />
        </ThemeProvider>
      </Provider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)

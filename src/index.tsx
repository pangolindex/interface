import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode, useContext } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NetworkContextName } from './constants'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import './i18n'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { ThemeProvider as NewThemeProvider } from '@pangolindex/components'
import getLibrary from './utils/getLibrary'
import { ThemeContext } from 'styled-components'
import { useIsBetaUI } from './hooks/useLocation'
import { GelatoProvider } from '@gelatonetwork/limit-orders-react'
import { useActiveWeb3React } from './hooks'
import Package from '../package.json'

import { SnackbarProvider } from "notistack";
import { BetaContextProvider } from "./contexts/BetaContext";
import { EthereumProviderProvider } from "./contexts/EthereumProviderContext";
import { SolanaWalletProvider } from "./contexts/SolanaWalletContext";
import { TerraWalletProvider } from "./contexts/TerraWalletContext";

Sentry.init({
  dsn: 'https://ff9ffce9712f415f8ad4c2a80123c984@o1080468.ingest.sentry.io/6086371',
  integrations: [new Integrations.BrowserTracing()],
  release: `pangolin-interface@${Package.version}`, //manual for now
  tracesSampleRate: 0.4,
  allowUrls: ['https://app.pangolin.exchange', 'https://beta-app.pangolin.exchange'],
  enabled: process.env.NODE_ENV === 'production',
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Blocked a frame with origin "https://app.pangolin.exchange" from accessing a cross-origin frame.'
  ]
})

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false

  // ;(window.ethereum).autoRefreshOnNetworkChange = false

}
const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
// const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

const queryClient = new QueryClient()

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

// const Gelato = ( children ) => {
const Gelato = ({ children }: { children?: React.ReactNode }) => {
  const { library, chainId, account } = useActiveWeb3React()
  return (
    <GelatoProvider
      library={library}
      chainId={chainId}
      account={account ?? undefined}
      useDefaultTheme={false}
      handler={'pangolin'}
    >
      {children}
    </GelatoProvider>
  )
}

const ComponentThemeProvider = () => {
  const isBeta = useIsBetaUI()
  const theme = useContext(ThemeContext)

  return (
    <NewThemeProvider theme={theme as any}>
      <FixedGlobalStyle isBeta={isBeta} />
      <ThemedGlobalStyle isBeta={isBeta} />
      <HashRouter>
        <Gelato>
          <App />
        </Gelato>
      </HashRouter>
    </NewThemeProvider>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          {/* <SnackbarProvider maxSnack={3}>
            <BetaContextProvider>
              <SolanaWalletProvider>
                <EthereumProviderProvider>
                  <TerraWalletProvider> */}
                      <QueryClientProvider client={queryClient}>
                        <Updaters />
                        <ThemeProvider>
                          <ComponentThemeProvider />
                        </ThemeProvider>
                      </QueryClientProvider>
                  {/* </TerraWalletProvider>
                </EthereumProviderProvider>
              </SolanaWalletProvider>
            </BetaContextProvider>
          </SnackbarProvider> */}
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,

  document.getElementById('root')
);

// ReactDOM.render(
//   <Provider store={store}>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//         <SnackbarProvider maxSnack={3}>
//           <BetaContextProvider>
//             <SolanaWalletProvider>
//               <EthereumProviderProvider>
//                 <TerraWalletProvider>
//                   <HashRouter>
//                     <BackgroundImage />
//                     <App />
//                   </HashRouter>
//                 </TerraWalletProvider>
//               </EthereumProviderProvider>
//             </SolanaWalletProvider>
//           </BetaContextProvider>
//         </SnackbarProvider>
//     </ThemeProvider>
//   </Provider>,

//   document.getElementById("root")
// );
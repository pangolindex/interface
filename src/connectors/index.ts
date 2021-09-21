import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@pangolindex/web3-react-injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '43114')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
  defaultChainId: NETWORK_CHAIN_ID
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [43113, 43114]
})

export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Pangolin',
  appLogoUrl: 'https://raw.githubusercontent.com/pangolindex/interface/master/public/images/384x384_App_Icon.png'
})

export const walletconnect = new WalletConnectConnector({
  rpc: {
    43114: NETWORK_URL
  },
  qrcode: true,
  bridge: 'https://bridge.walletconnect.org'
})

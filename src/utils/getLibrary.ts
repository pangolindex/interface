import { Web3Provider } from '@ethersproject/providers'

export default function getLibrary(provider: any): Web3Provider {
  try {
    const library = new Web3Provider(provider, 'any')
    library.pollingInterval = 15000
    return library
  } catch (error) {
    return provider
  }
}

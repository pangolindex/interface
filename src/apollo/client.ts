import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SUBGRAPH_BASE_URL } from 'src/constants'
import { ChainId } from '@pangolindex/sdk'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/exchange`
  }),
  cache: new InMemoryCache()
})

export const governanceClient = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/governance`
  }),
  cache: new InMemoryCache()
})

export const avalancheBlockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks'
  }),
  cache: new InMemoryCache()
})

export const blockClients: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> | undefined } = {
  [ChainId.AVALANCHE]: avalancheBlockClient,
  [ChainId.FUJI]: undefined,
  [ChainId.WAGMI]: undefined,
  [ChainId.COSTON]: undefined,
  [ChainId.NEAR_MAINNET]: undefined,
  [ChainId.NEAR_TESTNET]: undefined
}

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SUBGRAPH_BASE_URL } from 'src/constants'

import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@pangolindex/sdk'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/exchange`
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const governanceClient = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/governance`
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const avalancheMininchefV2Client = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/sarjuhansaliya/minichefv2-dummy',
  { headers: {} }
)

export const mininchefV2Clients = {
  [ChainId.AVALANCHE]: avalancheMininchefV2Client,
  [ChainId.FUJI]: undefined,
  [ChainId.WAGMI]: undefined,
  [ChainId.COSTON]: undefined
}

export const avalancheBlockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks'
  }),
  cache: new InMemoryCache()
})

export const blockClients = {
  [ChainId.AVALANCHE]: avalancheBlockClient,
  [ChainId.FUJI]: undefined,
  [ChainId.WAGMI]: undefined,
  [ChainId.COSTON]: undefined
}

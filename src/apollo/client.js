import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SUBGRAPH_BASE_URL } from 'src/constants'

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

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks'
  }),
  cache: new InMemoryCache()
})

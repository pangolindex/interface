import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'


export const blockClient = new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks',
    }),
    cache: new InMemoryCache(),
  })
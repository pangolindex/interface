import gql from 'graphql-tag'

export const HOURLY_PAIR_RATES = (pairAddress, blocks) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    block => `
      t${block.timestamp}: pair(id:"${pairAddress}", block: { number: ${block.number} }) { 
        token0Price
        token1Price
      }
    `
  )

  queryString += '}'
  return gql(queryString)
}

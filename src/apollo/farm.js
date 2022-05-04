import gql from 'graphql-tag'

export const GET_FARMS = gql`
  query farms($where: Farm_filter) {
    farms(where: $where) {
      id
      pid
      rewarderAddress
      pairAddress
      chefAddress
      tvl
      rewarder {
        id
        rewards {
          id
          multiplier
          token {
            id
            symbol
          }
        }
      }
      pair {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
    }
  }
`

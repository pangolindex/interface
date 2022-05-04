import gql from 'graphql-tag'

export const GET_MINICHEF = gql`
  query minichefs($where: Minichef_filter, $userAddress: String) {
    minichefs(where: $where, first: 1000) {
      id
      totalAllocPoint
      rewardPerSecond
      rewardsExpiration
      farms(first: 1000) {
        id
        pid
        tvl
        allocPoint
        rewarderAddress
        chefAddress
        pairAddress
        rewarder {
          id
          rewards {
            id
            token {
              id
              symbol
              derivedUSD
              name
              decimals
            }
            multiplier
          }
        }
        pair {
          id
          reserve0
          reserve1
          totalSupply
          token0 {
            id
            symbol
            derivedUSD
            name
            decimals
          }
          token1 {
            id
            symbol
            derivedUSD
            name
            decimals
          }
        }
        liquidityPositions(where: { userAddress: $userAddress }) {
          id
          liquidityTokenBalance
        }
      }
    }
  }
`

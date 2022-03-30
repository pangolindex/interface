import axios from 'axios'
import qs from 'qs'
import { useQuery } from 'react-query'
import { CAVAX, ChainId, Currency, Pair, Token, TokenAmount, CHAINS, Chain } from '@pangolindex/sdk'
import { ethers } from 'ethers'
<<<<<<< HEAD
import { CHAINS, ChainsId } from 'src/constants/chains'
import { useActiveWeb3React, useChainId } from 'src/hooks'
=======
import Logo from 'src/assets/images/logo.svg'
import { useActiveWeb3React } from 'src/hooks'
>>>>>>> 0859375 (Update sdk to 1.5.0)

export const AllChain: Chain = {
  id: 'all',
  chain_id: 0,
  name: 'All',
  symbol: 'ALL',
  mainnet: false,
  logo: Logo,
  pangolin_is_live: false,
  tracked_by_debank: true,
  rpc_uri: '',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
}
export interface Protocol {
  id: string
  name: string
  url: string
  logo: string
}

export class TokenDataUser {
  token: Currency | Token
  price: number
  amount: number
  usdValue: number
  protocol?: Protocol

  constructor(token: Token | Currency, price: number, amount: number, protocol?: Protocol) {
    this.token = token
    this.price = price
    this.amount = amount
    this.usdValue = price * amount
    this.protocol = protocol
  }
}

export class PairDataUser {
  pair: Pair
  usdValue: number
  protocol?: Protocol

  constructor(pair: Pair, usdValue: number, protocol?: Protocol) {
    this.pair = pair
    this.usdValue = usdValue
    this.protocol = protocol
  }
}

const openApi = axios.create({
  baseURL: 'https://openapi.debank.com/v1/user',
  timeout: 2000
})

// Get the USD balance of address of all chains (supported by Debank)
export function useGetChainsBalances() {
  const { account } = useActiveWeb3React()

  const query = qs.stringify(
    {
      id: account
    },
    {
      encodeValuesOnly: true
    }
  )

  return useQuery('getChainsBalances', async () => {
    if (account) {
      const response = await openApi.get(`/total_balance?${query}`)
      const data = response.data
      const chainbalances: { chainID: number; balance: number }[] = [
        {
          chainID: 0,
          balance: data?.total_usd_value
        }
      ]
      data?.chain_list?.forEach((chain: any) => {
        chainbalances.push({
          chainID: chain?.community_id,
          balance: chain?.usd_value
        })
      })
      return chainbalances
    }

    return [] as { chainID: number; balance: number }[]
  })
}

// Get the USD balance of address of connected chain
export function useGetChainBalance() {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const getChainBalance = async () => {
    if (account && chainId) {
      let chain = CHAINS.filter(chain => chain.chain_id === chainId)[0]
      if (!chain.mainnet && chainId == ChainId.WAGMI) {
        chain = CHAINS.filter(chain => chain.chain_id === ChainId.AVALANCHE)[0]
      }

      const query = qs.stringify(
        {
          id: account,
          chain_id: chain.symbol.toLowerCase()
        },
        {
          encodeValuesOnly: true
        }
      )

      const response = await openApi.get(`/chain_balance?${query}`)
      const data = response.data

      return data?.usd_value
    }

    return 0
  }
  return useQuery('getChainBalance', getChainBalance, { refetchInterval: 10000 })
}

// Get the Tokens of wallet
export function useGetWalletChainTokens() {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  // This functions is temporary for Pangolin birthday
  const getPangolinPairs = async () => {
    const query = qs.stringify(
      {
        id: account,
        protocol_id: 'avax_pangolin'
      },
      {
        encodeValuesOnly: true
      }
    )
    if (account && chainId) {
      const response = await openApi.get(`/protocol?${query}`)
      const data = response.data

      const requestPairs: (TokenDataUser | PairDataUser)[] = data?.portfolio_item_list.map((pair: any) => {
        const token1 = pair?.detail?.supply_token_list[0]
        const token2 = pair?.detail?.supply_token_list[1]
        // If token2 does not exist its because this pair is not a pair but a single staking
        if (!token2) {
          return new TokenDataUser(
            new Token(
              chainId,
              ethers.utils.getAddress(token1?.id),
              token1?.decimals,
              `${token1?.symbol} - Staked`,
              token1?.name
            ),
            token1?.price,
            token1?.amount
          )
        }

        const tokenA = new TokenAmount(
          new Token(chainId, ethers.utils.getAddress(token1?.id), token1?.decimals, token1?.symbol, token1?.name),
          token1?.amount.toString().replace('.', '')
        )

        const tokenB = new TokenAmount(
          new Token(chainId, ethers.utils.getAddress(token2?.id), token2?.decimals, token2?.symbol, token2?.name),
          token2?.amount.toString().replace('.', '')
        )

        return new PairDataUser(new Pair(tokenA, tokenB, chainId), pair?.stats?.net_usd_value)
      })
      return requestPairs
    }
    return []
  }

  const getBalance = async () => {
    if (account && chainId) {
      let chain = CHAINS.filter(chain => chain.chain_id === chainId)[0]
      if (!chain.mainnet) {
        chain = CHAINS.filter(chain => chain.chain_id === ChainId.AVALANCHE)[0]
      }

      const query = qs.stringify(
        {
          id: account,
          chain_id: chain.symbol.toLowerCase()
        },
        {
          encodeValuesOnly: true
        }
      )

      const response = await openApi.get(`/token_list?${query}`)
      const data = response.data

      const requestTokens: TokenDataUser[] = data.map((token: any) => {
        if (token?.id?.toLowerCase() === 'avax') {
          return new TokenDataUser(CAVAX[chainId], token?.price, token?.amount)
        }

        return new TokenDataUser(
          new Token(chainId, ethers.utils.getAddress(token?.id), token?.decimals, token?.symbol, token?.name),
          token?.price,
          token?.amount
        )
      })

      if (chainId === ChainId.AVALANCHE) {
        const pairs = await getPangolinPairs()
        const tokens = [...requestTokens, ...pairs]
        return tokens
      }

      return requestTokens
    }
    return []
  }

  return useQuery(
    'getWalletChainTokens',
    async () => {
      const tokens = await getBalance()
      tokens.sort((a, b) => b.usdValue - a.usdValue)

      const filterTokens = tokens.filter(token => token.usdValue >= 0.01)

      return filterTokens
    },
    {
      refetchInterval: 10000
    }
  )
}

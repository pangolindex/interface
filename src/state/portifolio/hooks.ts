import { CAVAX, ChainId, Currency, Pair, Token, TokenAmount } from '@pangolindex/sdk'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { CHAINS, ChainsId } from 'src/constants/chains'
import { useActiveWeb3React } from 'src/hooks'

export type ChainBalances = {
  [chainID in ChainsId]: number
}

interface ChainList {
  community_id: number
  usd_value: Number
}

interface Data {
  total_usd_value: number
  chain_list: ChainList[]
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

// Get the USD balance of address of all chains (supported by Debank)
export function useGetChainsBalances() {
  const [balances, setBalances] = useState<ChainBalances>({} as ChainBalances)

  const { account } = useActiveWeb3React()

  useEffect(() => {
    const getBalances = async () => {
      const response = await fetch(`https://openapi.debank.com/v1/user/total_balance?id=${account}`)
      const data: Data = await response.json()
      let chainbalances: any = {
        0: data?.total_usd_value
      }

      data?.chain_list?.forEach((chain: ChainList) => {
        chainbalances[chain?.community_id] = chain?.usd_value
      })

      setBalances(chainbalances)
    }
    if (!!account) {
      getBalances()
    }
  }, [account, setBalances])

  return balances
}

// Get the USD balance of address of connected chain
export function useGetChainBalance() {
  const [balance, setBalance] = useState<number>(0)

  let { chainId = ChainId.AVALANCHE, account } = useActiveWeb3React()

  if (chainId === ChainId.FUJI) {
    chainId = ChainId.AVALANCHE
  }

  const chain = CHAINS[chainId]
  useEffect(() => {
    const getBalance = async () => {
      const response = await fetch(
        `https://openapi.debank.com/v1/user/chain_balance?id=${account}&chain_id=${chain.symbol.toLowerCase()}`
      )
      const data = await response.json()

      setBalance(data?.usd_value)
    }

    if (!!account) {
      getBalance()
    }
  }, [account, chain, setBalance])

  return balance
}

// Get the Tokens of wallet
export function useGetWalletChainTokens(): [(TokenDataUser | PairDataUser)[], boolean] {
  const [tokens, setTokens] = useState<(TokenDataUser | PairDataUser)[]>([] as TokenDataUser[])

  const [loading, setLoading] = useState<boolean>(true)

  let { chainId = ChainId.AVALANCHE, account } = useActiveWeb3React()

  if (chainId === ChainId.FUJI) {
    chainId = ChainId.AVALANCHE
  }

  const chain = CHAINS[chainId]

  useEffect(() => {
    const getBalance = async (chainId: ChainId) => {
      const response = await fetch(
        `https://openapi.debank.com/v1/user/token_list?id=${account}&chain_id=${chain.symbol.toLowerCase()}`
      )
      const data = await response.json()

      const requestTokens: TokenDataUser[] = data.map((token: any) => {
        if (token?.id?.toLowerCase() === 'avax') {
          return new TokenDataUser(CAVAX, token?.price, token?.amount)
        }

        return new TokenDataUser(
          new Token(
            chainId,
            ethers.utils.getAddress(token?.id),
            token?.decimals,
            token?.symbol,
            token?.name
          ),
          token?.price,
          token?.amount
        )
      })

      if (chainId === ChainId.AVALANCHE) {
        const pairs = await getPangolinPairs()
        const tokens = [...requestTokens, ...pairs]
        setTokens(tokens)
        return; 
      }

      setTokens(requestTokens)
    }

    // This functions is temporary for Pangolin birthday 
    const getPangolinPairs = async () => {
      const response = await fetch(
        `https://openapi.debank.com/v1/user/protocol?id=${account}&protocol_id=avax_pangolin`
      )
      const data = await response.json()

      const requestPairs: (TokenDataUser | PairDataUser)[] = data?.portfolio_item_list.map((pair: any) => {
        const token1 = pair?.detail?.supply_token_list[0]
        const token2 = pair?.detail?.supply_token_list[1]
        // If token2 does not exist its because this pair is not a pair but a single staking
        if (!token2){
          return new TokenDataUser(
            new Token(
              chainId,
              ethers.utils.getAddress(token1?.id),
              token1?.decimals,
              `${token1?.symbol} - Staked`,
              token1?.name,
            ),
            token1?.price,
            token1?.amount
          )
        }

        const tokenA = new TokenAmount(
          new Token(
            chainId,
            ethers.utils.getAddress(token1?.id),
            token1?.decimals,
            token1?.symbol,
            token1?.name,
          ),
          token1?.amount.toString().replace('.', '')
        )

        const tokenB = new TokenAmount(
          new Token(
            chainId,
            ethers.utils.getAddress(token2?.id),
            token2?.decimals,
            token2?.symbol,
            token2?.name,
          ),
          token2?.amount.toString().replace('.', '')
        )

        return new PairDataUser(
          new Pair(tokenA, tokenB, chainId),
          pair?.stats?.net_usd_value
        )
      })
      setLoading(false)
      return requestPairs
    }


    if (!!account) {
      getBalance(chainId)
    }
  }, [account, chainId, chain, setTokens])

  return [tokens, loading]
}

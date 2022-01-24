import { CAVAX, ChainId, Currency, Pair, Token } from '@pangolindex/sdk'
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
  total_usd_value: number,
  chain_list: ChainList[]
}

export class TokenDataUser {
  token: Currency | Token;
  price: number;
  amount: number;

  constructor(token: Token | Currency, price: number, amount: number) {
    this.token = token;
    this.price = price;
    this.amount = amount;
  }
}

export class PairDataUser {
  pair: Pair;
  price: number;
  amount: number;

  constructor(pair: Pair, price: number, amount: number) {
    this.pair = pair;
    this.price = price;
    this.amount = amount;
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
      });

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
      const response = await fetch(`https://openapi.debank.com/v1/user/chain_balance?id=${account}&chain_id=${chain.symbol.toLowerCase()}`)
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
export function useGetWalletChainTokens() {
  const [tokens, setTokens] = useState<TokenDataUser[]>([] as TokenDataUser[])

  let { chainId = ChainId.AVALANCHE, account } = useActiveWeb3React()

  if (chainId === ChainId.FUJI) {
    chainId = ChainId.AVALANCHE
  }

  const chain = CHAINS[chainId]

  useEffect(() => {
    const getBalance = async () => {
      const response = await fetch(`https://openapi.debank.com/v1/user/token_list?id=${account}&chain_id=${chain.symbol.toLowerCase()}`)
      const data = await response.json()

      const requestTokens: TokenDataUser[] = data.map((token: any) => {
        if (token?.id?.toLowerCase() === "avax") {
          return new TokenDataUser(
            CAVAX,
            token?.price,
            token?.amount
          )
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

      setTokens(requestTokens)
    }

    if (!!account) {
      getBalance()
    }

  }, [account, chainId, chain, setTokens])

  return tokens
}
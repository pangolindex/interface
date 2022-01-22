import { ChainId } from '@pangolindex/sdk'
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

      data.chain_list.forEach((chain: ChainList) => {
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

      setBalance(data.usd_value)
    }

    if (!!account) {
      getBalance()
    }

  }, [account, chain, setBalance])

  return balance
}
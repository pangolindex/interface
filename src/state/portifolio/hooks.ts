import { ChainId } from '@pangolindex/sdk'
import { useEffect, useState } from 'react'
import { CHAINS } from 'src/constants/chains'
import { useActiveWeb3React } from 'src/hooks'

interface ResponseChain{
    id: string
    usd_value: Number
}

// Get the USD balance of address of all chains (supported by Debank)
export function useGetChainsBalances() {
    const [balances, setBalances] = useState<{}>()

    const { account } = useActiveWeb3React()

    useEffect(() => {
      const getBalances = async () => {
        const  response = await fetch(`https://openapi.debank.com/v1/user/total_balance?id=${account}`)
        const data = await response.json()
        let chainbalances: any = {
            all: data.total_usd_value
        }
        console.log(chainbalances)
        data.chain_list.forEach((chain: ResponseChain) => {
            chainbalances[chain.id] = chain.usd_value
        });
        setBalances(chainbalances)
      }

      getBalances()

    }, [account, setBalances])
  
    return balances
}

// Get the USD balance of address of connected chain
export function useGetChainBalance() {
    const [balance, setBalance] = useState<number>(0)

    let { chainId = ChainId.AVALANCHE , account } = useActiveWeb3React()

    if (chainId === ChainId.FUJI){
      chainId = ChainId.AVALANCHE
    }

    const chain = CHAINS[chainId]
    useEffect(() => {
      const getBalance = async () => {
        const  response = await fetch(`https://openapi.debank.com/v1/user/chain_balance?id=${account}&chain_id=${chain.symbol.toLowerCase()}`)
        const data = await response.json()
        console.log(data)
        setBalance(data.usd_value)
      }

      getBalance()
  
    }, [account, chain, setBalance])
  
    return balance
}
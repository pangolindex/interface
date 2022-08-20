import { TransactionResponse } from '@ethersproject/providers'
import { useChainId, usePngSymbol } from 'src/hooks'
import { useMerkledropContract } from '../../hooks/useContract'
import { waitForTransaction } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import { TokenAmount } from '@pangolindex/sdk'
import { PNG } from '../../constants/tokens'
import { useSingleCallResult } from '../multicall/hooks'
import { useLibrary } from '@pangolindex/components'
import { ZERO_ADDRESS } from 'src/constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

export function useMerkledropClaimedAmounts(account: string | null | undefined) {
  const chaindId = useChainId()
  const merkledropContract = useMerkledropContract()
  const claimedAmountsState = useSingleCallResult(merkledropContract, 'claimedAmounts', [account ?? ZERO_ADDRESS])

  return useMemo(() => {
    if (!account) {
      new TokenAmount(PNG[chaindId], '0')
    }
    return new TokenAmount(PNG[chaindId], claimedAmountsState.result?.[0]?.toString() || '0')
  }, [chaindId, account, claimedAmountsState])
}

export function useMerkledropProof(account: string | null | undefined) {
  const chaindId = useChainId()
  return useQuery(
    ['MerkledropProof', account, chaindId],
    async () => {
      if (!account)
        return {
          amount: new TokenAmount(PNG[chaindId], '0'),
          proof: [],
          root: ''
        }
      try {
        const response = await axios.get(`https://storage.googleapis.com/merkle-drop/${chaindId}/${account}.json`)
        if (response.status !== 200) {
          return {
            amount: new TokenAmount(PNG[chaindId], '0'),
            proof: [],
            root: ''
          }
        }
        const data = response.data
        return {
          amount: new TokenAmount(PNG[chaindId], data.amount),
          proof: data.proof as string[],
          root: data.root as string
        }
      } catch (error) {
        return {
          amount: new TokenAmount(PNG[chaindId], '0'),
          proof: [],
          root: ''
        }
      }
    },
    {
      cacheTime: 1000 * 60 * 60 * 1, // 1 hour
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 1 // 1 hour
    }
  )
}

export function useClaimAirdrop(account: string | null | undefined) {
  const { library } = useLibrary()
  const pngSymbol = usePngSymbol()

  const merkledropContract = useMerkledropContract()
  const { data } = useMerkledropProof(account)

  const [hash, setHash] = useState<string | null>(null)
  const [attempting, setAttempting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addTransaction = useTransactionAdder()

  const onClaim = async () => {
    if (!merkledropContract || !data || data.proof.length === 0 || !account) return
    setAttempting(true)
    try {
      const response: TransactionResponse = await merkledropContract.claim(data.amount.raw.toString(), data.proof, {
        gasLimit: BigNumber.from(200000000)
      })
      await waitForTransaction(library, response, 5)

      addTransaction(response, {
        summary: `Claimed ${pngSymbol} and deposited in the SAR`,
        claim: { recipient: account }
      })
      setHash(response.hash)
    } catch (err) {
      // we only care if the error is something _other_ than the user rejected the tx
      const _err = err as any
      if (_err?.code !== 4001) {
        console.error(_err)
        setError(_err.message)
      }
    } finally {
      setAttempting(false)
    }
  }

  return { onClaim, hash, attempting, error }
}

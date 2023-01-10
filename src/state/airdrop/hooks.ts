import { TransactionResponse } from '@ethersproject/providers'
import { useChainId, usePngSymbol } from 'src/hooks'
import { useMerkledropContract } from '../../hooks/useContract'
import { calculateGasMargin, waitForTransaction } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import { AirdropType, TokenAmount } from '@pangolindex/sdk'
import { PNG } from '../../constants/tokens'
import { useLibrary } from '@pangolindex/components'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { MixPanelEvents, useMixpanel } from 'src/hooks/mixpanel'
import { BigNumber } from 'ethers'

export function useMerkledropClaimedAmounts(airdropAddress: string) {
  const { account } = useWeb3React()
  const chainId = useChainId()
  const png = PNG[chainId]

  const merkledropContract = useMerkledropContract(airdropAddress, AirdropType.MERKLE)
  return useQuery(['claimed-airdrop-amount', merkledropContract?.address, account, chainId], async () => {
    if (!account || !merkledropContract) {
      return new TokenAmount(png, '0')
    }
    const claimedAmount: BigNumber = await merkledropContract.claimedAmounts(account)
    return new TokenAmount(png, claimedAmount.toString())
  })
}

export function useMerkledropProof(airdropAddress: string) {
  const { account } = useWeb3React()
  const chainId = useChainId()

  return useQuery(
    ['MerkledropProof', account, chainId, airdropAddress],
    async () => {
      if (!account)
        return {
          amount: new TokenAmount(PNG[chainId], '0'),
          proof: [],
          root: ''
        }

      try {
        const response = await axios.get(
          `https://static.pangolin.exchange/merkle-drop/${chainId}/${airdropAddress.toLocaleLowerCase()}/${account.toLocaleLowerCase()}.json`
        )
        if (response.status !== 200) {
          return {
            amount: new TokenAmount(PNG[chainId], '0'),
            proof: [],
            root: ''
          }
        }
        const data = response.data
        return {
          amount: new TokenAmount(PNG[chainId], data.amount),
          proof: data.proof as string[],
          root: data.root as string
        }
      } catch (error) {
        return {
          amount: new TokenAmount(PNG[chainId], '0'),
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

export function useClaimAirdrop(airdropAddress: string, airdropType: AirdropType) {
  const { account } = useWeb3React()
  const chainId = useChainId()
  const { library, provider } = useLibrary()
  const pngSymbol = usePngSymbol()

  const merkledropContract = useMerkledropContract(airdropAddress, airdropType)
  const { data } = useMerkledropProof(airdropAddress)

  const [hash, setHash] = useState<string | null>(null)
  const [attempting, setAttempting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addTransaction = useTransactionAdder()

  const mixpanel = useMixpanel()

  const onDimiss = () => {
    setHash(null)
    setAttempting(false)
    setError(null)
  }

  const onClaim = async () => {
    if (!merkledropContract || !data || data.proof.length === 0 || !account) return
    setAttempting(true)
    try {
      const args = airdropType === AirdropType.LEGACY ? [] : [data.amount.raw.toString(), data.proof]
      let summary = `Claimed ${pngSymbol}`

      if (airdropType === AirdropType.MERKLE_TO_STAKING_COMPLIANT) {
        summary += ' and deposited in the SAR'

        const message = `By signing this transaction, I hereby acknowledge that I am not a US resident or citizen. (Citizens or residents of the United States of America are not allowed to the ${pngSymbol} token airdrop due to applicable law.)`
        let signature = await provider?.execute('personal_sign', [message, account])

        const v = parseInt(signature.slice(130, 132), 16)

        // Ensure v is 27+ (generally 27|28)
        // Ledger and perhaps other signing methods utilize a 'v' of 0|1 instead of 27|28
        if (v < 27) {
          const vAdjusted = v + 27
          console.log(`Adjusting ECDSA 'v' from ${v} to ${vAdjusted}`)
          signature = signature.slice(0, -2).concat(vAdjusted.toString(16))
        }

        args.push(signature)
      }

      const estimedGas = await merkledropContract.estimateGas.claim(...args)
      const response: TransactionResponse = await merkledropContract.claim(...args, {
        gasLimit: calculateGasMargin(estimedGas)
      })
      await waitForTransaction(library, response, 3)

      addTransaction(response, {
        summary: summary,
        claim: { recipient: account }
      })
      setHash(response.hash)

      mixpanel.track(MixPanelEvents.CLAIM_AIRDROP, {
        chainId: chainId,
        airdropType: airdropType
      })
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

  return { onClaim, onDimiss, hash, attempting, error }
}

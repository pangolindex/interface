import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useAddPopup, useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'
import { useLibrary } from '@pangolindex/components'

export function shouldCheck(
  lastBlockNumber: number,
  tx: {
    addedTime: number
    receipt?: {
      /* */
    }
    lastCheckedBlockNumber?: number
  }
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

export default function Updater(): null {
  const { chainId } = useActiveWeb3React()
  const { library, provider } = useLibrary()
  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>(_state => _state.transactions)

  const transactions = chainId ? state[chainId] ?? {} : {} // eslint-disable-line react-hooks/exhaustive-deps

  // show popup on confirm
  const addPopup = useAddPopup()

  useEffect(() => {
    if (!chainId || !library || !provider || !lastBlockNumber) return

    Object.keys(transactions)
      .filter(hash => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach(async hash => {
        try {
          const receipt = await (provider as any).getTransactionReceipt(hash)

          if (receipt) {
            dispatch(
              finalizeTransaction({
                chainId,
                hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: receipt.blockNumber,
                  // contractAddress: receipt.contractAddress,
                  contractAddress: '',
                  from: receipt.from,
                  // status: receipt.status,
                  status: 1,
                  to: receipt.to,
                  // transactionHash: receipt.transactionHash,
                  transactionHash: receipt.hash,
                  transactionIndex: receipt.transactionIndex
                }
              })
            )

            addPopup(
              {
                txn: {
                  hash,
                  // success: receipt.status === 1,
                  success: true,
                  summary: transactions[hash]?.summary
                }
              },
              hash
            )
          } else {
            dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
          }
        } catch (error) {
          console.error(`failed to check transaction hash: ${hash}`, error)
        }
      })
  }, [chainId, library, provider, transactions, lastBlockNumber, dispatch, addPopup])

  return null
}

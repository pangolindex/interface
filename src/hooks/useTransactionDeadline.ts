import { BigNumber } from 'ethers'
import { useSelector } from 'react-redux'
import { AppState } from '../state'

// combines the current timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): BigNumber | undefined {
  const ttl = useSelector<AppState, number>(state => state.user.userDeadline)
  const currentTimestamp = BigNumber.from(new Date().getTime() + 100000)
  if (currentTimestamp && ttl) return currentTimestamp.add(ttl)
  return undefined
}

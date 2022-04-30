import { BigNumber } from 'ethers'
import { useSelector } from 'react-redux'
import { AppState } from '../state'

// combines the current timestamp with the user setting to give the deadline that should be used for any submitted transaction
// enforces a minimum deadline of 10 seconds from now
export default function useTransactionDeadline(): BigNumber | undefined {
  const ttl = useSelector<AppState, number>(state => state.user.userDeadline)
  const currentTimestampSeconds = BigNumber.from(Math.ceil(Date.now() / 1000))
  return ttl && ttl > 10 ? currentTimestampSeconds.add(ttl) : currentTimestampSeconds.add(10)
}

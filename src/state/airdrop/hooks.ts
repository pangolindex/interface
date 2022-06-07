import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useAirdropContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import { TokenAmount, JSBI } from '@pangolindex/sdk'
import { PNG } from '../../constants/tokens'
import { useSingleCallResult } from '../multicall/hooks'

export function useAirdropIsClaimingAllowed(): boolean {
  const airdropContract = useAirdropContract()
  const claimingAllowedResult = useSingleCallResult(airdropContract, 'claimingAllowed', [])

  return Boolean(
    !claimingAllowedResult.loading &&
      claimingAllowedResult.result !== undefined &&
      claimingAllowedResult.result[0] === true
  ) // eslint-disable-line eqeqeq
}

export function useUserHasAvailableClaim(account: string | null | undefined): boolean {
  const airdropContract = useAirdropContract()
  const withdrawAmountResult = useSingleCallResult(airdropContract, 'withdrawAmount', [account ? account : undefined])
  return Boolean(
    account &&
      !withdrawAmountResult.loading &&
      withdrawAmountResult.result !== undefined &&
      !JSBI.equal(JSBI.BigInt(withdrawAmountResult.result?.[0]), JSBI.BigInt(0))
  ) // eslint-disable-line eqeqeq
}

export function useUserUnclaimedAmount(account: string | null | undefined): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()

  const canClaim = useUserHasAvailableClaim(account)
  const airdropContract = useAirdropContract()
  const withdrawAmountResult = useSingleCallResult(airdropContract, 'withdrawAmount', [account ? account : undefined])

  const png = chainId ? PNG[chainId] : undefined
  if (!png) return undefined
  if (!canClaim) {
    return new TokenAmount(png, JSBI.BigInt(0))
  }
  return new TokenAmount(png, JSBI.BigInt(withdrawAmountResult.result?.[0]))
}

export function useClaimCallback(
  account: string | null | undefined
): {
  claimCallback: () => Promise<string>
} {
  const { library, chainId } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const airdropContract = useAirdropContract()

  const claimCallback = async function() {
    if (!account || !library || !chainId || !airdropContract) return

    return airdropContract.estimateGas['claim']({}).then(estimatedGasLimit => {
      return airdropContract
        .claim({ value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claimed PNG`,
            claim: { recipient: account }
          })
          return response.hash
        })
        .catch((error: any) => {
          console.log(error)
          return ''
        })
    })
  }

  return { claimCallback }
}

import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useAirdropContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'

export function useClaimCallback(
	account: string | null | undefined
): {
	claimCallback: () => Promise<string>
} {
	const { library, chainId } = useActiveWeb3React()

	const addTransaction = useTransactionAdder()
	const airdropContract = useAirdropContract()

	const claimCallback = async function () {
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
		})
	}

	return { claimCallback }
}
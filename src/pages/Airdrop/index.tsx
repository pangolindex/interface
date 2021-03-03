import React, { useContext, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Card from '../../components/Card'
import { ButtonError } from '../../components/Button'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { useClaimCallback, useUserHasAvailableClaim, useUserUnclaimedAmount } from '../../state/airdrop/hooks'
import { useActiveWeb3React } from '../../hooks'
import Confetti from '../../components/Confetti'
import { useTokenBalance } from '../../state/wallet/hooks'
import { UNI, SUSHI } from '../../constants'
import { ChainId, JSBI } from '@pangolindex/sdk'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const EmptyProposals = styled.div`
   border: 1px solid ${({ theme }) => theme.text4};
   padding: 16px 12px;
   border-radius: 12px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin-top: 1rem;
 `

export const Dots = styled.span`
   &::after {
     display: inline-block;
     animation: ellipsis 1.25s infinite;
     content: '.';
     width: 1em;
     text-align: left;
   }
   @keyframes ellipsis {
     0% {
       content: '.';
     }
     33% {
       content: '..';
     }
     66% {
       content: '...';
     }
   }
 `

export default function Vote() {
	const { account, chainId } = useActiveWeb3React()

	const theme = useContext(ThemeContext)

	// used for UI loading states
	const [attempting, setAttempting] = useState<boolean>(false)

	// monitor the status of the claim from contracts and txns
	const { claimCallback } = useClaimCallback(account)

	const canClaim = useUserHasAvailableClaim(account)

	const claimAmount = useUserUnclaimedAmount(account)

	const uniAmount = useTokenBalance(account ? account : undefined, chainId ? UNI[chainId] : UNI[ChainId.AVALANCHE])
	const sushiAmount = useTokenBalance(account ? account : undefined, chainId ? SUSHI[chainId] : SUSHI[ChainId.AVALANCHE])

	const hasUni = uniAmount?.greaterThan(JSBI.BigInt(1)) || uniAmount?.equalTo(JSBI.BigInt(1))
	const hasSushi = sushiAmount?.greaterThan(JSBI.BigInt(1)) || sushiAmount?.equalTo(JSBI.BigInt(1))

	const [hash, setHash] = useState<string | undefined>()

	// monitor the status of the claim from contracts and txns
	const claimPending = useIsTransactionPending(hash ?? '')
	const claimConfirmed = hash && !claimPending

	const [error, setError] = useState<any | undefined>()

	// use the hash to monitor this txn

	function onClaim() {
		setAttempting(true)
		claimCallback()
			.then(hash => {
				setAttempting(false)
				setHash(hash)
			})
			// reset and log error
			.catch(err => {
				setAttempting(false)
				setError(err)
			})
	}

	return (
		<PageWrapper gap="lg" justify="center">
			<TopSection gap="2px">
				<Confetti start={Boolean(claimConfirmed)} />
				<TYPE.mediumHeader style={{ margin: '0.5rem 0' }} textAlign="center">Claim PNG from Airdrop</TYPE.mediumHeader>
				{!account ? (
					<Card padding="40px">
						<TYPE.body color={theme.text3} textAlign="center">
							Connect to a wallet to view your liquidity.
           				</TYPE.body>
					</Card>
				) : !canClaim ? (
					<Card padding="40px">
						<TYPE.body color={theme.text3} textAlign="center">
							You have no available claim.
           				</TYPE.body>
					</Card>
				) : (!hasUni && !hasSushi) ? (
					<Card padding="40px">
						<TYPE.body color={theme.text1} textAlign="center">
							You have no UNI or SUSHI tokens. Please follow the tutorial here to add UNI or SUSHI tokens to your wallet.
           				</TYPE.body>
						<TYPE.body mt="1rem" color={theme.text1} textAlign="center">
							{"You have " + claimAmount?.toFixed(0, { groupSeparator: ',' }) + " PNG available to claim"}
						</TYPE.body>
					</Card>
				) : attempting ? (
					<EmptyProposals>
						<TYPE.body color={theme.text3} textAlign="center">
							<Dots>Loading</Dots>
						</TYPE.body>
					</EmptyProposals>
				) : claimConfirmed ? (
					<TYPE.subHeader mt="1rem" fontWeight={500} color={theme.text1}>
						<span role="img" aria-label="party-hat">
							🎉{' '}
						</span>
						Welcome to team Pangolin
						<span role="img" aria-label="party-hat">
							{' '}🎉
						</span>
					</TYPE.subHeader>
				) : (
										<ButtonError
											error={!!error}
											padding="16px 16px"
											width="100%"
											mt="1rem"
											onClick={onClaim}
										>
											{error ? error['data']['message'] : "Claim " + claimAmount?.toFixed(0, { groupSeparator: ',' }) + " PNG"}
										</ButtonError>
									)}

			</TopSection>
		</PageWrapper >
	)
}
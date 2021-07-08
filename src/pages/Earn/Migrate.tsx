import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { RouteComponentProps } from 'react-router-dom'
import { useCurrency } from '../../hooks/Tokens'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { usePair } from '../../data/Reserves'
import { useWalletModalToggle } from '../../state/application/hooks'
import StakingModal from '../../components/earn/StakingModal'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'

const PageWrapper = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const VoteCard = styled(DataCard)`
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
   overflow: hidden;
 `

export default function Migrate({
	match: {
		params: { currencyIdToA, currencyIdToB, versionTo, currencyIdFromA, currencyIdFromB, versionFrom }
	}
}: RouteComponentProps<{ currencyIdToA: string; currencyIdToB: string; versionTo: string; currencyIdFromA: string; currencyIdFromB: string; versionFrom: string }>) {
	const { account, chainId } = useActiveWeb3React()

	// get currencies and pair
	const [currencyToA, currencyToB, currencyFromA, currencyFromB] = [useCurrency(currencyIdToA), useCurrency(currencyIdToB), useCurrency(currencyIdFromA), useCurrency(currencyIdFromB)]
	const tokenToA = wrappedCurrency(currencyToA ?? undefined, chainId)
	const tokenToB = wrappedCurrency(currencyToB ?? undefined, chainId)
	const tokenFromA = wrappedCurrency(currencyFromA ?? undefined, chainId)
	const tokenFromB = wrappedCurrency(currencyFromB ?? undefined, chainId)

	const [, stakingTokenPairTo] = usePair(tokenToA, tokenToB)
	const [, stakingTokenPairFrom] = usePair(tokenFromA, tokenFromB)

	const stakingInfoTo = useStakingInfo(Number(versionTo), stakingTokenPairTo)?.[0]
	const stakingInfoFrom = useStakingInfo(Number(versionFrom), stakingTokenPairFrom)?.[0]

	const userLiquidityUnstakedOld = useTokenBalance(account ?? undefined, stakingInfoFrom?.stakedAmount?.token)
	const userLiquidityUnstakedNew = useTokenBalance(account ?? undefined, stakingInfoTo?.stakedAmount?.token)

	// detect if old LP tokens are staked
	const requiresUnstake = stakingInfoFrom?.stakedAmount?.greaterThan('0')

	// detect if old LP is owned and not staked
	const requiresBurn = userLiquidityUnstakedOld?.greaterThan('0')

	// detect if LP needs to be converted
	const requiresConvert = userLiquidityUnstakedOld && userLiquidityUnstakedNew && !userLiquidityUnstakedOld.equalTo(userLiquidityUnstakedNew)

	// detect if new LP has been minted and not staked
	const requiresMint = userLiquidityUnstakedNew?.equalTo('0')
	const requiresStake = userLiquidityUnstakedNew?.greaterThan('0')

	// detect if new LP tokens are staked
	const requiresNothing = stakingInfoTo?.stakedAmount?.equalTo('0')

	const [showStakingModal, setShowStakingModal] = useState(false)
	const [showUnstakingModal, setShowUnstakingModal] = useState(false)
	const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

	const toggleWalletModal = useWalletModalToggle()

	const handleDepositClick = useCallback(() => {
		if (account) {
			setShowStakingModal(true)
		} else {
			toggleWalletModal()
		}
	}, [account, toggleWalletModal])

	return (
		<PageWrapper gap="lg" justify="center">
			<RowBetween style={{ gap: '24px' }}>
				<TYPE.mediumHeader style={{ margin: 0 }}>
					Liquidity Migration
         </TYPE.mediumHeader>
			</RowBetween>

			{(requiresUnstake || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step 1. Unstake Pangolin liquidity tokens (PGL)</TYPE.white>
							</RowBetween>
							<RowBetween style={{ marginBottom: '1rem' }}>
								<TYPE.white fontSize={14}>
									{`You are currently staking deprecated PGL tokens. You must unstake to continue the migration process`}
								</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								onClick={() => setShowUnstakingModal(true)}
							>
								{`Unstake ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{(requiresBurn || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step 2. Convert Pangolin liquidity (PGL) into the underlying assets</TYPE.white>
							</RowBetween>
							<RowBetween style={{ marginBottom: '1rem' }}>
								<TYPE.white fontSize={14}>
									{`You are currently holding deprecated PGL tokens. You must claim and withdraw your principal continue the migration process`}
								</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								as={Link}
								to={`/remove/${currencyFromA && currencyId(currencyFromA)}/${currencyFromB && currencyId(currencyFromB)}`}
							>
								{`Withdraw ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{(requiresConvert || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step 3. Convert deprecated asset to the new asset</TYPE.white>
							</RowBetween>
							<RowBetween style={{ marginBottom: '1rem' }}>
								<TYPE.white fontSize={14}>
									{`You are currently holding a deprecated token. You should convert 1:1 to the new token`}
								</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								onClick={() => window.location.href=`https://aeb.xyz`}
							>
								{`Convert ASSET (old) to ASSET (new)`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{(requiresMint || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step 4. Get Pangolin Liquidity tokens (PGL)</TYPE.white>
							</RowBetween>
							<RowBetween style={{ marginBottom: '1rem' }}>
								<TYPE.white fontSize={14}>
									{`PGL tokens are required. Once you've added liquidity to the ${currencyToA?.symbol}-${currencyToB?.symbol} pool you can stake your liquidity tokens on this page.`}
								</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								as={Link}
								to={`/add/${currencyToA && currencyId(currencyToA)}/${currencyToB && currencyId(currencyToB)}`}
							>
								{`Add new ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{(requiresStake || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step 5. Stake Pangolin liquidity (PGL) to earn PNG</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								onClick={handleDepositClick}
							>
								{`Stake ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}


			{(requiresNothing || true) && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Congratulations you have successfully migrated!</TYPE.white>
							</RowBetween>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{stakingInfoFrom && stakingInfoTo && (
				<>
					<ClaimRewardModal
						isOpen={showClaimRewardModal}
						onDismiss={() => setShowClaimRewardModal(false)}
						stakingInfo={stakingInfoFrom}
					/>
					<StakingModal
						isOpen={showStakingModal}
						onDismiss={() => setShowStakingModal(false)}
						stakingInfo={stakingInfoTo}
						userLiquidityUnstaked={userLiquidityUnstakedNew}
					/>
					<UnstakingModal
						isOpen={showUnstakingModal}
						onDismiss={() => setShowUnstakingModal(false)}
						stakingInfo={stakingInfoFrom}
					/>
				</>
			)}

		</PageWrapper>
	)
}

// setShowStakingModal(true) && check for wallet
// onClick={() => setShowUnstakingModal(true)}
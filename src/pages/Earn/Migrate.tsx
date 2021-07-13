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

  const currentlyStakingOld = stakingInfoFrom?.stakedAmount

	const userLiquidityUnstakedOld = useTokenBalance(account ?? undefined, stakingInfoFrom?.stakedAmount?.token)
	const userLiquidityUnstakedNew = useTokenBalance(account ?? undefined, stakingInfoTo?.stakedAmount?.token)

  const userOldBalanceToken0 = useTokenBalance(account ?? undefined, stakingInfoFrom?.tokens[0])
  const userOldBalanceToken1 = useTokenBalance(account ?? undefined, stakingInfoFrom?.tokens[1])

	// detect if old LP tokens are staked
	const requiresUnstake = currentlyStakingOld?.greaterThan('0')

	// detect if old LP is currently held and cannot be migrated directly to the new staking contract
	const requiresBurn = userLiquidityUnstakedOld?.greaterThan('0') && !stakingInfoFrom?.stakedAmount?.token.equals(stakingInfoTo?.stakedAmount?.token)

	// detect if underlying token needs to be converted
  const requiresConvertingToken0 = stakingInfoFrom && stakingInfoTo && !stakingInfoTo?.tokens.includes(stakingInfoFrom?.tokens[0]) && userOldBalanceToken0?.greaterThan('0')
  const requiresConvertingToken1 = stakingInfoFrom && stakingInfoTo && !stakingInfoTo?.tokens.includes(stakingInfoFrom?.tokens[1]) && userOldBalanceToken1?.greaterThan('0')
	const requiresConvert = requiresConvertingToken0 || requiresConvertingToken1

	// detect if new LP has been minted and not staked
	const requiresMint = userLiquidityUnstakedNew?.equalTo('0')
	const requiresStake = userLiquidityUnstakedNew?.greaterThan('0')

	// detect if all steps have been completed
	const requiresNothing = !requiresUnstake && !requiresBurn && !requiresConvert && !requiresMint && !requiresStake

	const [showStakingModal, setShowStakingModal] = useState(false)
	const [showUnstakingModal, setShowUnstakingModal] = useState(false)

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

      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Step 1. Unstake Pangolin liquidity tokens (PGL)</TYPE.white>
            </RowBetween>
            {(requiresUnstake) && (
              <>
                <RowBetween style={{ marginBottom: '1rem' }}>
                  <TYPE.white fontSize={14}>
                    {`You are currently staking deprecated PGL tokens. Unstake to continue the migration process`}
                  </TYPE.white>
                </RowBetween>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width={'fit-content'}
                  onClick={() => setShowUnstakingModal(true)}
                >
                  {`Unstake ${currentlyStakingOld?.toSignificant(4) ?? ''} ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
                </ButtonPrimary>
              </>
            )}
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Step 2. Convert Pangolin liquidity tokens (PGL) into the underlying assets</TYPE.white>
            </RowBetween>
            {(requiresBurn) && (
              <>
                <RowBetween style={{ marginBottom: '1rem' }}>
                  <TYPE.white fontSize={14}>
                    {`You are currently holding deprecated PGL tokens. Claim and withdraw your principal to continue the migration process`}
                  </TYPE.white>
                </RowBetween>
                <ButtonPrimary
                  padding="8px"
                  width={'fit-content'}
                  as={Link}
                  to={`/remove/${currencyFromA && currencyId(currencyFromA)}/${currencyFromB && currencyId(currencyFromB)}`}
                >
                  {`Withdraw ${userLiquidityUnstakedOld?.toSignificant(4) ?? ''} ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
                </ButtonPrimary>
              </>
            )}
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Step 3. Convert deprecated tokens</TYPE.white>
            </RowBetween>
            {(requiresConvert) && (
              <>
                <RowBetween style={{ marginBottom: '1rem' }}>
                  <TYPE.white fontSize={14}>
                    {`You are currently holding a deprecated token. Convert to the new token 1:1 to continue the migration process`}
                  </TYPE.white>
                </RowBetween>
                {(requiresConvertingToken0 || true) && (
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    width={'fit-content'}
                    onClick={() => window.location.href=`https://aeb.xyz`}
                  >
                    {`Convert deprecated ${stakingInfoFrom?.tokens[0].symbol ?? 'token'}`}
                  </ButtonPrimary>
                )}
                {(requiresConvertingToken1) && (
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    width={'fit-content'}
                    onClick={() => window.location.href=`https://aeb.xyz`}
                  >
                    {`Convert deprecated ${stakingInfoFrom?.tokens[1].symbol ?? 'token'}`}
                  </ButtonPrimary>
                )}
              </>
            )}
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Step 4. Get Pangolin liquidity tokens (PGL)</TYPE.white>
            </RowBetween>
            {(requiresMint) && (
              <>
                <RowBetween style={{ marginBottom: '1rem' }}>
                  <TYPE.white fontSize={14}>
                    {`You are not currently holding PGL tokens for this pool. Provide liquidity to the ${currencyToA?.symbol}-${currencyToB?.symbol} pool to receive PGL tokens representing your share of the liquidity pool`}
                  </TYPE.white>
                </RowBetween>
                <ButtonPrimary
                  padding="8px"
                  width={'fit-content'}
                  as={Link}
                  to={`/add/${currencyToA && currencyId(currencyToA)}/${currencyToB && currencyId(currencyToB)}`}
                >
                  {`Add new ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
                </ButtonPrimary>
              </>
            )}
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      <VoteCard>
        <CardBGImage />
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Step 5. Stake Pangolin liquidity (PGL) to earn PNG</TYPE.white>
            </RowBetween>
            {(requiresStake) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width={'fit-content'}
                  onClick={handleDepositClick}
                >
                  {`Stake ${userLiquidityUnstakedNew?.toSignificant(4) ?? ''} ${currencyToA?.symbol}-${currencyToB?.symbol} liquidity`}
                </ButtonPrimary>
              </>
            )}
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

			{(requiresNothing) && (
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

import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { RouteComponentProps } from 'react-router-dom'
import { useCurrency } from '../../hooks/Tokens'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
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

const StepCard = styled(DataCard)`
  background: #22242A;
  overflow: hidden;
`

export default function Migrate({
	match: {
		params: { currencyIdFromA, currencyIdFromB, versionFrom, currencyIdToA, currencyIdToB, versionTo }
	}
}: RouteComponentProps<{ currencyIdFromA: string; currencyIdFromB: string; versionFrom: string; currencyIdToA: string; currencyIdToB: string; versionTo: string; }>) {
	const { account, chainId } = useActiveWeb3React()

	// get currencies and pair
	const [currencyFromA, currencyFromB, currencyToA, currencyToB] = [useCurrency(currencyIdFromA), useCurrency(currencyIdFromB), useCurrency(currencyIdToA), useCurrency(currencyIdToB)]
  const tokenFromA = wrappedCurrency(currencyFromA ?? undefined, chainId)
  const tokenFromB = wrappedCurrency(currencyFromB ?? undefined, chainId)
	const tokenToA = wrappedCurrency(currencyToA ?? undefined, chainId)
	const tokenToB = wrappedCurrency(currencyToB ?? undefined, chainId)

  const [, stakingTokenPairFrom] = usePair(tokenFromA, tokenFromB)
	const [, stakingTokenPairTo] = usePair(tokenToA, tokenToB)

  const stakingInfoFrom = useStakingInfo(Number(versionFrom), stakingTokenPairFrom)?.[0]
	const stakingInfoTo = useStakingInfo(Number(versionTo), stakingTokenPairTo)?.[0]

  const currentlyStakingOld = stakingInfoFrom?.stakedAmount

	const userLiquidityUnstakedOld = useTokenBalance(account ?? undefined, stakingInfoFrom?.stakedAmount?.token)
	const userLiquidityUnstakedNew = useTokenBalance(account ?? undefined, stakingInfoTo?.stakedAmount?.token)

  const userOldBalanceToken0 = useTokenBalance(account ?? undefined, stakingInfoFrom?.tokens[0])
  const userOldBalanceToken1 = useTokenBalance(account ?? undefined, stakingInfoFrom?.tokens[1])

  const userNewBalanceToken0 = useTokenBalance(account ?? undefined, stakingInfoTo?.tokens[0])
  const userNewBalanceToken1 = useTokenBalance(account ?? undefined, stakingInfoTo?.tokens[1])

  // Step 1: Detect if old LP tokens are staked
	const requiresUnstake = currentlyStakingOld?.greaterThan('0')

	// Step 2: Detect if old LP is currently held and cannot be migrated directly to the new staking contract
	const requiresBurn = (!requiresUnstake)
    && userLiquidityUnstakedOld?.greaterThan('0')
    && !stakingInfoFrom?.stakedAmount?.token.equals(stakingInfoTo?.stakedAmount?.token)

	// Step 3: Detect if underlying token needs to be converted
  const requiresConvertingToken0 = stakingInfoFrom && stakingInfoTo && !stakingInfoTo?.tokens.includes(stakingInfoFrom?.tokens[0]) && userOldBalanceToken0?.greaterThan('0')
  const requiresConvertingToken1 = stakingInfoFrom && stakingInfoTo && !stakingInfoTo?.tokens.includes(stakingInfoFrom?.tokens[1]) && userOldBalanceToken1?.greaterThan('0')
	const requiresConvert = (!requiresUnstake && !requiresBurn) && (requiresConvertingToken0 || requiresConvertingToken1)

	// Step 4: Detect if underlying tokens are available but not provided as liquidity
	const requiresMint = (!requiresUnstake && !requiresBurn && !requiresConvert)
    && userNewBalanceToken0?.greaterThan('0')
    && userNewBalanceToken1?.greaterThan('0')
    && userLiquidityUnstakedNew?.equalTo('0')

  // Step 5: Detect if new LP has been minted and not staked
	const requiresStake = (!requiresUnstake && !requiresBurn && !requiresConvert && !requiresMint) && userLiquidityUnstakedNew?.greaterThan('0')

	// Detect if all steps have been completed
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

      <StepCard>
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
      </StepCard>

      <StepCard>
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
      </StepCard>

      <StepCard>
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
                {(requiresConvertingToken0) && (
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
      </StepCard>

      <StepCard>
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
      </StepCard>

      <StepCard>
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
      </StepCard>

			{(requiresNothing) && (
				<StepCard>
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Congratulations you have successfully migrated!</TYPE.white>
							</RowBetween>
						</AutoColumn>
					</CardSection>
				</StepCard>
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

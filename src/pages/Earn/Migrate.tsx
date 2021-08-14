import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { useCurrency } from '../../hooks/Tokens'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import { BRIDGE_MIGRATORS, useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { usePair } from '../../data/Reserves'
import { useWalletModalToggle } from '../../state/application/hooks'
import StakingModal from '../../components/earn/StakingModal'
import UnstakingModal from '../../components/earn/UnstakingModal'
import Confetti from '../../components/Confetti'
import RemoveLiquidityModal from '../../components/earn/RemoveLiquidityModal'
import UpgradeTokenModal from '../../components/earn/UpgradeTokenModal'
import AddLiquidityModal from '../../components/earn/AddLiquidityModal'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const StepCard = styled(DataCard)`
  background: #22242A;
  overflow: hidden;
`

const SuccessCard = styled(DataCard)`
  background: green;
  overflow: hidden;
`

export default function Migrate({
  match: {
    params: {
      currencyIdFromA,
      currencyIdFromB,
      versionFrom,
      currencyIdToA,
      currencyIdToB,
      versionTo
    }
  }
}: RouteComponentProps<{ currencyIdFromA: string; currencyIdFromB: string; versionFrom: string; currencyIdToA: string; currencyIdToB: string; versionTo: string; }>) {
  const { account, chainId } = useActiveWeb3React()

  // get currencies and pair
  const [currencyFromA, currencyFromB, currencyToA, currencyToB] = [useCurrency(currencyIdFromA), useCurrency(currencyIdFromB), useCurrency(currencyIdToA), useCurrency(currencyIdToB)]
  const tokenFromA = wrappedCurrency(currencyFromA ?? undefined, chainId)
  const tokenFromB = wrappedCurrency(currencyFromB ?? undefined, chainId)
  const tokenToA = wrappedCurrency(currencyToA ?? undefined, chainId)
  const tokenToB = wrappedCurrency(currencyToB ?? undefined, chainId)

  const [, pglFrom] = usePair(tokenFromA, tokenFromB)
  const [, pglTo] = usePair(tokenToA, tokenToB)

  const stakingInfoFrom = useStakingInfo(Number(versionFrom), pglFrom)?.[0]
  const stakingInfoTo = useStakingInfo(Number(versionTo), pglTo)?.[0]

  const currentlyStakingOld = stakingInfoFrom?.stakedAmount

  const userLiquidityUnstakedOld = useTokenBalance(account ?? undefined, pglFrom?.liquidityToken)
  const userLiquidityUnstakedNew = useTokenBalance(account ?? undefined, pglTo?.liquidityToken)

  const userOldBalanceToken0 = useTokenBalance(account ?? undefined, pglFrom?.token0)
  const userOldBalanceToken1 = useTokenBalance(account ?? undefined, pglFrom?.token1)

  const userNewBalanceToken0 = useTokenBalance(account ?? undefined, pglTo?.token0)
  const userNewBalanceToken1 = useTokenBalance(account ?? undefined, pglTo?.token1)

  // Step 1: Detect if old LP tokens are staked
  const requiresUnstake = currentlyStakingOld?.greaterThan('0')

  // Step 2: Detect if old LP is currently held and cannot be migrated directly to the new staking contract
  const requiresBurn = (!requiresUnstake)
    && userLiquidityUnstakedOld?.greaterThan('0')
    && pglFrom?.liquidityToken?.address !== pglTo?.liquidityToken?.address

  // Step 3: Detect if underlying token needs to be converted
  const requiresConvertingToken0 = userOldBalanceToken0?.greaterThan('0') && pglFrom?.token0 && !pglTo?.involvesToken(pglFrom?.token0)
  const token0MigratorAddress = requiresConvertingToken0 && BRIDGE_MIGRATORS.find(entry => entry.aeb === pglFrom?.token0?.address)?.ab
  const requiresConvertingToken1 = userOldBalanceToken1?.greaterThan('0') && pglFrom?.token1 && !pglTo?.involvesToken(pglFrom?.token1)
  const token1MigratorAddress = requiresConvertingToken1 && BRIDGE_MIGRATORS.find(entry => entry.aeb === pglFrom?.token1?.address)?.ab
  const requiresConvert = (!requiresUnstake && !requiresBurn) && (requiresConvertingToken0 || requiresConvertingToken1)

  // Step 4: Detect if underlying tokens are available but not provided as liquidity
  const requiresMint = (!requiresUnstake && !requiresBurn && !requiresConvert)
    && userNewBalanceToken0?.greaterThan('0')
    && userNewBalanceToken1?.greaterThan('0')
    && userLiquidityUnstakedNew?.equalTo('0')

  // Step 5: Detect if new LP has been minted and not staked
  const requiresStake = (!requiresUnstake && !requiresBurn && !requiresConvert && !requiresMint)
    && stakingInfoTo
    && userLiquidityUnstakedNew?.greaterThan('0')

  // Detect if all steps have been completed
  const requiresNothing = !!stakingInfoFrom && !!stakingInfoTo && !requiresUnstake && !requiresBurn && !requiresConvert && !requiresMint && !requiresStake

  const [aebTokenBalance, setAebTokenBalance] = useState(userOldBalanceToken0)
  const [abTokenAddress, setAbTokenAddress] = useState('')

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showRemoveLiquidityModal, setShowRemoveLiquidityModal] = useState(false)
  const [showUpgradeTokenModal, setShowUpgradeTokenModal] = useState(false)
  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false)
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
                  {`Unstake ${currentlyStakingOld?.toSignificant(4) ?? ''} ${tokenFromA?.symbol}-${tokenFromB?.symbol} liquidity`}
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
                  borderRadius="8px"
                  width={'fit-content'}
                  onClick={() => setShowRemoveLiquidityModal(true)}
                >
                  {`Withdraw ${userLiquidityUnstakedOld?.toSignificant(4) ?? ''} ${tokenFromA?.symbol}-${tokenFromB?.symbol} liquidity`}
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
              <TYPE.white fontWeight={600}>Step 3. Upgrade deprecated tokens</TYPE.white>
            </RowBetween>
            {(requiresConvert) && (
              <>
                <RowBetween style={{ marginBottom: '1rem' }}>
                  <TYPE.white fontSize={14}>
                    {`You are currently holding a deprecated token. Upgrade to the new token 1:1 to continue the migration process`}
                  </TYPE.white>
                </RowBetween>
                {(requiresConvertingToken0) && (
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    width={'fit-content'}
                    onClick={() => {
                      if (token0MigratorAddress) {
                        setAebTokenBalance(userOldBalanceToken0)
                        setAbTokenAddress(token0MigratorAddress)
                        setShowUpgradeTokenModal(true)
                      } else {
                        window.open('https://bridge.avax.network/convert', '_blank')
                      }
                    }}
                  >
                    {`Upgrade ${userOldBalanceToken0?.toSignificant(4) ?? ''} ${pglFrom?.token0?.symbol ?? 'token'}`}
                  </ButtonPrimary>
                )}
                {(requiresConvertingToken1) && (
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    width={'fit-content'}
                    onClick={() => {
                      if (token1MigratorAddress) {
                        setAebTokenBalance(userOldBalanceToken1)
                        setAbTokenAddress(token1MigratorAddress)
                        setShowUpgradeTokenModal(true)
                      } else {
                        window.open('https://bridge.avax.network/convert', '_blank')
                      }
                    }}
                  >
                    {`Upgrade ${userOldBalanceToken1?.toSignificant(4) ?? ''} ${pglFrom?.token1?.symbol ?? 'token'}`}
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
                    {`You are not currently holding PGL tokens for this pool. Provide liquidity to the ${tokenToA?.symbol}-${tokenToB?.symbol} pool to receive PGL tokens representing your share of the liquidity pool`}
                  </TYPE.white>
                </RowBetween>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width={'fit-content'}
                  onClick={() => setShowAddLiquidityModal(true)}
                >
                  {`Add new ${tokenToA?.symbol}-${tokenToB?.symbol} liquidity`}
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
                  {`Stake ${userLiquidityUnstakedNew?.toSignificant(4) ?? ''} ${tokenToA?.symbol}-${tokenToB?.symbol} liquidity`}
                </ButtonPrimary>
              </>
            )}
          </AutoColumn>
        </CardSection>
      </StepCard>

      {(requiresNothing) && (
        <SuccessCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Congratulations you have successfully migrated!</TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </SuccessCard>
      )}

      <Confetti start={requiresNothing && !showStakingModal} />

      {(stakingInfoFrom && stakingInfoTo && tokenFromA && tokenFromB && tokenToA && tokenToB) && (
        <>
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfoFrom}
          />
          <RemoveLiquidityModal
            isOpen={showRemoveLiquidityModal}
            onDismiss={() => setShowRemoveLiquidityModal(false)}
            currencyIdA={tokenFromA.address}
            currencyIdB={tokenFromB.address}
          />
          <UpgradeTokenModal
            isOpen={showUpgradeTokenModal}
            onDismiss={() => setShowUpgradeTokenModal(false)}
            aebTokenBalance={aebTokenBalance}
            abTokenAddress={abTokenAddress}
          />
          <AddLiquidityModal
            isOpen={showAddLiquidityModal}
            onDismiss={() => setShowAddLiquidityModal(false)}
            currencyIdA={tokenToA.address}
            currencyIdB={tokenToB.address}
          />
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfoTo}
            userLiquidityUnstaked={userLiquidityUnstakedNew}
          />
        </>
      )}

    </PageWrapper>
  )
}
